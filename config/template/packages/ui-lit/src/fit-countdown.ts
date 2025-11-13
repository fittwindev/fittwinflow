import {LitElement, html, css} from 'lit';
export class FitCountdown extends LitElement{
  static properties={seconds:{type:Number},label:{type:String},autostart:{type:Boolean}};
  seconds=10; label="Auto-capture at"; autostart=true; #tid:any;
  static styles=css`:host{display:block}.ring{width:120px;height:120px;border-radius:999px;border:6px solid rgba(0,0,0,.06);display:grid;place-items:center}.num{font:700 42px/1.1 system-ui}`;
  connectedCallback(){super.connectedCallback(); if(this.autostart) this.start()}
  disconnectedCallback(){super.disconnectedCallback(); clearInterval(this.#tid)}
  start(){clearInterval(this.#tid); this.#tid=setInterval(()=>{this.seconds--; if(this.seconds<=0){this.dispatchEvent(new CustomEvent('zero')); clearInterval(this.#tid)} this.requestUpdate()},1000)}
  render(){return html`<div class="ring"><div class="num">${this.seconds}</div></div><div>${this.label} 0</div>`}
}
if(!customElements.get('fit-countdown')){
  customElements.define('fit-countdown', FitCountdown);
}
