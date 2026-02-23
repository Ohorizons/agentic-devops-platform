export class CPXUser extends HTMLElement {
    static get tag() { return 'cpx-user'; }
    get userId() {
        return this._userId;
    }
    set userId(val) {
        if (this._userId === val)
            return;
        this._userId = val;
        this.setAttribute("user-id", this._userId);
    }
    get givenname() {
        return this._givenname;
    }
    set givenname(val) {
        if (this._givenname === val)
            return;
        this._givenname = val;
        this.setAttribute("givenname", this._givenname);
    }
    get email() {
        return this._email;
    }
    set email(val) {
        if (this._email === val)
            return;
        this._email = val;
        this.setAttribute("email", this._email);
    }
    get token() {
        return this._token;
    }
    set token(val) {
        if (this._token === val)
            return;
        this._token = val;
        this.setAttribute("token", this._token);
        try {
            this.user = this._token.split('.').reduce((a, c) => a[c], window);
        }
        catch {
            this.user = {};
        }
    }
    get eddl() {
        return this._eddl;
    }
    set eddl(val) {
        if (typeof val === "string") {
            val = true;
        }
        if (val === null) {
            val = false;
        }
        if (this._eddl === val) {
            return;
        }
        else {
            this._eddl = val;
            if (this._eddl) {
                this.setAttribute("eddl", "");
            }
            else {
                this.removeAttribute("eddl");
            }
        }
    }
    get noCookies() {
        return this._noCookies;
    }
    set noCookies(val) {
        if (typeof val === "string") {
            val = true;
        }
        if (val === null) {
            val = false;
        }
        if (this._noCookies === val) {
            return;
        }
        else {
            this._noCookies = val;
            if (this._noCookies) {
                this.setAttribute("no-cookies", "");
            }
            else {
                this.removeAttribute("no-cookies");
            }
        }
    }
    get eddlCustKey() { return this._eddlCustKey; }
    set eddlCustKey(val) {
        if (this._eddlCustKey === val)
            return;
        this._eddlCustKey = val;
    }
    get eddlUserId() { return this._eddlUserId; }
    set eddlUserId(val) {
        if (this._eddlUserId === val)
            return;
        this._eddlUserId = val;
    }
    get eddlLoggedIn() { return this._eddlLoggedIn; }
    set eddlLoggedIn(val) {
        if (this.eddlLoggedIn === val)
            return;
        this._eddlLoggedIn = val;
    }
    get ready() {
        return this._ready;
    }
    set ready(val) {
        if (this._ready === val)
            return;
        this._ready = val;
        this.setAttribute("ready", this._ready.toString());
    }
    get user() {
        return this._user;
    }
    set user(val) {
        if (this._user === val || typeof val === 'undefined')
            return;
        this._user = val;
        if (typeof this._user.email !== "undefined")
            this.email = this._user.email;
        if (typeof this._user.name !== "undefined")
            this.givenname = this._user.givenname;
        this.dispatchEvent(new CustomEvent(this.ready ? "user-update" : "user-ready", {
            detail: this,
            composed: true,
            bubbles: true,
        }));
        if (this.eddl) {
            this.initWorker();
        }
        this.ready = true;
    }
    get worker() { return this._worker; }
    constructor() {
        super();
        this._authenticated = false;
        this._userId = "";
        this._givenname = "";
        this._email = "";
        this._eddl = false;
        this._noCookies = false;
        this._eddlCustKey = 'rh_common_id';
        this._eddlUserId = 'rh_user_id';
        this._eddlLoggedIn = 'rh_sso_session';
        this._ready = false;
        this.onmessage = this.onmessage.bind(this);
    }
    connectedCallback() {
        let data = this.querySelector("script");
        if (data && data.innerText) {
            this.user = JSON.parse(data.innerText);
        }
        if (this.eddl && !this.noCookies) {
            this.addEventListener('token-ready', e => {
                e.stopImmediatePropagation();
                this.user = e['detail'];
                return false;
            });
        }
    }
    static get observedAttributes() {
        return [
            "givenname",
            "surname",
            "email",
            "username",
            "user-id",
            "eddl",
            "token",
            "no-cookies"
        ];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[this.camelCase(name)] = newVal;
    }
    async generateHash(txt) {
        const encoder = new TextEncoder();
        const hash = await crypto.subtle.digest('SHA-256', encoder.encode(txt));
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    camelCase(str, to = true) {
        return to
            ? str.replace(/-([a-z])/g, (m, g) => g.toUpperCase())
            : str.replace(/([a-z][A-Z])/g, (m, g) => `${g[0]}-${g[1].toLowerCase()}`);
    }
    onmessage(e) {
        const data = e.data;
        if (data.action) {
            switch (data.action) {
                case 'getCookies':
                    if (data.results) {
                        Object.assign(this.user, data.results);
                    }
                    this.dispatchEDDL();
                    break;
                case 'getToken':
                    if (data.results) {
                        Object.assign(this.user, data.results);
                    }
                    this.dispatchEDDL();
                    break;
            }
        }
    }
    async dispatchEDDL() {
        this.user['loggedIn'] = this.user.sub ? true : false;
        let hashedEmail = '';
        if (typeof this.user['email'] !== 'undefined' && this.user['email'].length && this.user['email'].length > 0) {
            hashedEmail = await this.generateHash(this.user['email']);
        }
        this.dispatchEvent(new CustomEvent("eddl-user-ready", {
            detail: {
                "ebsAccountNumber": this.user['account_number'] || '',
                "hashedEmail": hashedEmail,
                "lastLoginDate": this.user['auth_time'] ? (new Date(this.user['auth_time'] * 1000)).toISOString() : '',
                "loggedIn": !!this.user['loggedIn'],
                "organizationID": "",
                "socialAccountsLinked": "",
                "ssoClientID": "",
                "userID": this.user['sub'] ?? ''
            },
            composed: true,
            bubbles: true,
        }));
    }
    async initWorker() {
        if (!this._worker) {
            try {
                this._worker = new Worker(import.meta.url.replace('cpx-user.js', 'user.js'));
                this.worker['onmessage'] = this.onmessage;
            }
            catch {
                const { Peasant } = await import(import.meta.url.replace('cpx-user.js', 'peasant.js'));
                this._worker = new Peasant(this);
            }
        }
        if (this.eddl && !this.noCookies) {
            this._worker.postMessage({
                action: 'getCookies',
                values: new Map([
                    ['rh_common_id', 'custKey'],
                    ['rh_user_id', 'userID'],
                    ['rh_sso_session', 'loggedIn']
                ]),
                payload: document.cookie
            });
        }
        else if (this.eddl) {
        }
    }
}
window.customElements.define(CPXUser.tag, CPXUser);
