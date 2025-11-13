import {LitElement, html, css} from 'lit';
export class FitLidarBanner extends LitElement{
  static properties={active:{type:Boolean},unavailable:{type:Boolean}}
  active=false; unavailable=false;
  static styles=css`:host{display:block;margin:8px 0}
  .b{padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,.08)}
  .ok{background:rgba(16,184,166,.1);color:#0d5d55}
  .warn{background:rgba(217,119,6,.08);color:#8a5409}`;
  render(){return html`
    <div class="b ${this.active?'ok':this.unavailable?'warn':''}">
      ${this.active?'Active depth sensing': this.unavailable?'LiDAR unavailable: falling back to 2-photo baseline':'Depth status unknown'}
    </div>`}
}
if(!customElements.get('fit-lidar-banner')){
  customElements.define('fit-lidar-banner', FitLidarBanner);
}
