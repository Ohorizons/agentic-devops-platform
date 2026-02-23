var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class CPXCookie extends HTMLElement {
    constructor() {
        super();
        this.ready = false;
        this._debug = false;
        this._emit = 'cookie-ready';
        this.onmessage = this.onmessage.bind(this);
    }
    static get tag() { return 'cpx-cookie'; }
    get worker() { return this._worker; }
    get debug() { return this._debug; }
    set debug(val) {
        if (this._debug === val)
            return;
        this._debug = val;
    }
    get cookie() { return this._cookie; }
    set cookie(val) {
        this._cookie = val;
    }
    get action() { return this._action; }
    set action(val) {
        if (this._action === val)
            return;
        this._action = val;
        this.setAttribute('action', this._action);
    }
    get parse() { return this._parse; }
    set parse(val) {
        if (this._parse === val)
            return;
        this._parse = val;
        this.setAttribute('parse', this._parse);
    }
    get emit() { return this._emit; }
    set emit(val) {
        if (this._emit === val)
            return;
        this._emit = val;
        this.setAttribute('emit', this._emit);
    }
    get key() { return this._key; }
    set key(val) {
        if (this._key === val)
            return;
        this._key = val;
        this.setAttribute('key', this._key);
    }
    get value() { return this._value; }
    set value(val) {
        if (this._value === val)
            return;
        this._value = val;
        this.setAttribute('value', this._value);
    }
    get data() { return this._data; }
    set data(val) {
        if (this._data === val)
            return;
        this._data = val;
    }
    connectedCallback() {
        this.initWorker();
    }
    static get observedAttributes() {
        return [
            "action",
            "parse",
            "emit",
            "key",
            "value",
            "debug"
        ];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    onmessage(e) {
        if (this.action === 'set') {
            document.cookie = e.data;
        }
        this.data = e.data;
        this.dispatchEvent(new CustomEvent(this.emit, {
            bubbles: true,
            composed: true,
            detail: e.data
        }));
    }
    initWorker() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._worker = new Worker(import.meta.url.replace('cpx-cookie.js', 'cutter.js'));
                this.worker['onmessage'] = this.onmessage;
            }
            catch (_a) {
                const { Baker } = yield import(import.meta.url.replace('cpx-cookie.js', 'baker.js'));
                this._worker = new Baker(this);
            }
            this.worker['postMessage']({
                action: this.action,
                payload: { key: this.key, data: this.action === 'set' ? this.value : document.cookie, parse: this.parse }
            });
        });
    }
}
window.customElements.define(CPXCookie.tag, CPXCookie);
