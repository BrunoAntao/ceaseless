(()=>{"use strict";class t{constructor(t){this.options=Object.assign({width:800,height:600,backgroundColor:"rgba(0,0,0,0)",container:document.body,drawBodies:!1},t),this.canvas=document.createElement("canvas"),this.canvas.width=this.options.width,this.canvas.height=this.options.height,this.ctx=this.canvas.getContext("2d"),this.options.container.append(this.canvas),this.objects=[],this.bodies=[],this.Modules={},this.lastCalledTime,this.lastTimestamp,this.fps,this.ctx.font="20px Arial",this.textMetrics=this.ctx.measureText(this.fps),requestAnimationFrame((()=>{this.render()}))}useModule(t){return this.Modules[t.name]=t,t.register(),this.Modules[t.name]}renderFPS(){if(!this.lastCalledTime)return this.lastTimestamp=performance.now(),this.lastCalledTime=performance.now(),void(this.fps=0);let t=(performance.now()-this.lastCalledTime)/1e3;this.lastCalledTime=performance.now(),performance.now()-this.lastTimestamp>1e3&&(this.lastTimestamp=performance.now(),this.fps="FPS: "+Math.floor(1/t))}update(){}physicsUpdate(){this.update();for(let t=0;t<this.bodies.length;t++){const s=this.bodies[t];for(let e=t+1;e<this.bodies.length;e++){const t=this.bodies[e],i=s.collides[t.uuid];if(i)if(s instanceof Physics.Group)if(t instanceof Physics.Group)for(const e of s.bodies)for(const s of t.bodies)Physics.collisionUpdate(e,s,i);else for(const e of s.bodies)Physics.collisionUpdate(e,t,i);else Physics.collisionUpdate(s,t,i)}}}render(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle=this.options.backgroundColor,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ffffff",this.ctx.fillText(this.fps,8,8+this.textMetrics.actualBoundingBoxAscent),this.physicsUpdate();for(const t of this.objects)t.update&&t.update(),t.render();if(this.options.drawBodies)for(const t of this.bodies)if(t instanceof Physics.Group)for(const e of t.bodies)s.DrawPath(this,e);else s.DrawPath(this,t);this.renderFPS(),requestAnimationFrame((()=>{this.render()}))}}const s={DrawPath:(t,s)=>{t.ctx.strokeStyle="#ff00ff",t.ctx.beginPath();const e=s.vecs[0];t.ctx.moveTo(e.x,e.y);for(let e=1;e<s.vecs.length;e++){const i=s.vecs[e];t.ctx.lineTo(i.x,i.y)}t.ctx.closePath(),t.ctx.stroke()}};class e{constructor(t=0,s=0){this.x=t,this.y=s}static sum(t=new e,s=new e){return new e(t.x+s.x,t.y+s.y)}clone(){return new e(this.x,this.y)}angleBetween(t=new e){return new Angle(Math.atan2(t.y-this.y,t.x-this.x))}rotate(t=new Angle,s=new e){const i=Math.cos(t),o=Math.sin(t),n=this.x,h=this.y;this.x=(n-s.x)*i-(h-s.y)*o+s.x,this.y=(n-s.x)*o+(h-s.y)*i+s.y}rotateTo(t=new Angle,s=new e){const i=this.angleBetween(s);t-i!=Number.EPSILON&&this.rotate(t-i,s)}}class i extends class{constructor(t){this.name=t}register(){console.log(`Module ${this.name} loaded.`)}}{constructor(){super("AssetLoader"),this.assets={}}load(t,s){this.assets[t]=s,s.then((s=>{this.assets[t]=s}))}loadSprite(t,s,e,i){this.load(t,new Promise((o=>{let n=new Image;n.onload=()=>{o({key:t,image:n,path:s,frameWidth:e,frameHeight:i})},n.src=s})))}getAsset(t){return this.assets[t]}loaded(){return Promise.all(Object.values(this.assets))}}class o extends class{constructor(t,s=new e){this.scene=t,this.scene.objects.push(this),this.position=s}remove(){this.scene.objects.splice(this.scene.objects.indexOf(this),1)}render(){}}{constructor(t,s,i=new e){super(t,i),this.key=s,this.asset=t.Modules.AssetLoader.getAsset(s),this.anchor=new e(0,0),this.width=this.asset.image.width,this.height=this.asset.image.height}render(){this.scene.ctx.drawImage(this.asset.image,this.position.x-this.anchor.x*this.width,this.position.y-this.anchor.y*this.height)}}document.addEventListener("DOMContentLoaded",(async s=>{let n=new t({backgroundColor:"rgba(33, 33, 33, 1)"});const h=n.useModule(new i);h.loadSprite("player","/client/assets/player.png",16,16),await h.loaded();let a=new o(n,"player",new e(0,0)),c={x:1,y:1};n.update=()=>{a.position.x>n.canvas.width-a.width&&(c.x=-1),a.position.y>n.canvas.height-a.height&&(c.y=-1),a.position.x<0&&(c.x=1),a.position.y<0&&(c.y=1),a.position.x+=c.x,a.position.y+=c.y}}))})();