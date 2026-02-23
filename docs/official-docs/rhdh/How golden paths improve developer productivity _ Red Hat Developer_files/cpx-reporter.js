import { ReporterEvent } from "./reporter.js";
export class CPXReporter extends HTMLElement {
    constructor() {
        super();
        this._debug = null;
        this._scope = 'global';
        this._data = {};
        this.tasks = new Set(['beat', 'event', 'data']);
        this._ready = false;
        this._emit = 'cpx-report';
        this.report = this.report.bind(this);
    }
    static get tag() { return 'cpx-reporter'; }
    get debug() {
        return this._debug;
    }
    set debug(val) {
        if (this._debug === val)
            return;
        this._debug = val;
    }
    get beat() { return this._beat; }
    set beat(val) {
        if (this._beat === val)
            return;
        this._beat = val;
        if (this.scope === 'global') {
            top.addEventListener(this.beat, this.report);
        }
        else {
            this.addEventListener(this.beat, this.report);
        }
        this.setAttribute('beat', this._beat);
    }
    get scope() { return this._scope; }
    set scope(val) {
        if (this._scope === val)
            return;
        this._scope = val;
        this.setAttribute('scope', this._scope);
    }
    get event() { return this._event; }
    set event(val) {
        if (this._event === val)
            return;
        this._event = val;
        this.setAttribute('event', this._event);
        this.evt = 'eddl-' + this._event.toLowerCase().split(' ').join('-');
    }
    get evt() { return this._evt; }
    set evt(val) {
        if (this._evt === val)
            return;
        this._evt = val;
        this.setAttribute('evt', this._evt);
    }
    get option() { return this._option; }
    set option(val) {
        if (this._option === val)
            return;
        this._option = val;
        this.setAttribute('option', this._option);
    }
    get data() { return this._data; }
    set data(val) {
        if (this._data === val)
            return;
        this._data = val;
    }
    get ready() { return this._ready; }
    set ready(val) {
        if (this._ready === !!val)
            return;
        this._ready = !!val;
        if (this._ready) {
            this.report({});
        }
    }
    get emit() { return this._emit; }
    set emit(val) {
        if (this._emit === val)
            return;
        this._emit = val;
    }
    connectedCallback() {
        const dataEle = this.querySelector(':scope > script[type="data"]');
        if (dataEle) {
            this.data = JSON.parse(dataEle.textContent);
        }
        const attrs = new Set();
        for (let i = 0; i < this.attributes.length; i++) {
            attrs.add(this.attributes[i]);
        }
        this.tasks.forEach(r => {
            if (!attrs.has(r)) {
                this.tasks.delete(r);
            }
        });
    }
    static get observedAttributes() {
        return [
            "scope",
            "data",
            "emit",
            "event",
            "beat",
            "debug",
            "option"
        ];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
        if (this.tasks.has(name)) {
            this.tasks.delete(name);
        }
        if (this.getAttribute('auto') === '' && this.tasks.size === 0) {
            this.ready = true;
        }
    }
    report(e) {
        var _a, _b, _c;
        if (this.debug !== null) {
            if (this.debug !== 'verbose') {
                console.log('DEBUG ON');
            }
            else {
                console.log('VERBOSE DEBUG ON');
            }
        }
        const detail = e['detail'];
        if (this.option) {
            this.data = Object.assign((_a = this.data) !== null && _a !== void 0 ? _a : {}, (_b = detail[this.option]) !== null && _b !== void 0 ? _b : {});
        }
        else {
            this.data = Object.assign((_c = this.data) !== null && _c !== void 0 ? _c : {}, detail !== null && detail !== void 0 ? detail : {});
        }
        this.dispatchEvent(new ReporterEvent(this.event, this.data, this.emit));
        this.dispatchEvent(new CustomEvent(this.evt, { bubbles: true, composed: true }));
    }
}
window.customElements.define(CPXReporter.tag, CPXReporter);
