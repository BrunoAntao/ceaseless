(()=>{"use strict";class t{constructor(e=0){this.value=e instanceof t?e.valueOf():e}valueOf(){return this.value}toDegrees(){return this.value*(180/Math.PI)}setDegrees(t){return this.value=t*Math.PI/180,this.value}}class e{constructor(t=0,e=0){this.x=t,this.y=e}static sum(t=new e,s=new e){return new e(t.x+s.x,t.y+s.y)}clone(){return new e(this.x,this.y)}angleBetween(s=new e){return new t(Math.atan2(s.y-this.y,s.x-this.x))}rotate(s=new t,i=new e){const o=Math.cos(s),n=Math.sin(s),h=this.x,r=this.y;this.x=(h-i.x)*o-(r-i.y)*n+i.x,this.y=(h-i.x)*n+(r-i.y)*o+i.y}rotateTo(s=new t,i=new e){const o=this.angleBetween(i);s-o!=Number.EPSILON&&this.rotate(s-o,i)}}class s{constructor(t){this.options=Object.assign({width:800,height:600,backgroundColor:"rgba(0,0,0,0)",container:document.body},t),this.canvas=document.createElement("canvas"),this.canvas.width=this.options.width,this.canvas.height=this.options.height,this.ctx=this.canvas.getContext("2d"),this.options.container.append(this.canvas),this.objects=[],this.Modules={},this.lastCalledTime,this.lastTimestamp,this.fps,this.ctx.font="20px Arial",this.textMetrics=this.ctx.measureText(this.fps),requestAnimationFrame((()=>{this.render()}))}useModule(t){return this.Modules[t.name]=t,t.register(this),this.Modules[t.name]}renderFPS(){if(!this.lastCalledTime)return this.lastTimestamp=performance.now(),this.lastCalledTime=performance.now(),void(this.fps=0);let t=(performance.now()-this.lastCalledTime)/1e3;this.lastCalledTime=performance.now(),performance.now()-this.lastTimestamp>1e3&&(this.lastTimestamp=performance.now(),this.fps="FPS: "+Math.floor(1/t))}update(){}render(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle=this.options.backgroundColor,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.update();for(const t of this.objects)t.update&&t.update();const t=Object.values(this.Modules);for(const e of t)e.update();for(const t of this.objects)t.cull()||t.render();for(const e of t)e.render();this.ctx.fillStyle="#ffffff",this.ctx.fillText(this.fps,8,8+this.textMetrics.actualBoundingBoxAscent),this.renderFPS(),requestAnimationFrame((()=>{this.render()}))}}const i=(t,e)=>{t.ctx.strokeStyle="#ff00ff",t.ctx.beginPath();const s=e.vecs[0];t.ctx.moveTo(s.x,s.y);for(let s=1;s<e.vecs.length;s++){const i=e.vecs[s];t.ctx.lineTo(i.x,i.y)}t.ctx.closePath(),t.ctx.stroke()};class o{constructor(t,e={}){this.name=t,this.options=e}update(){}render(){}register(t){this.scene=t,console.log(`Module ${this.name} loaded.`)}}class n extends o{constructor(){super("AssetLoader"),this.assets={}}load(t,e){this.assets[t]=e,e.then((e=>{this.assets[t]=e}))}loadSprite(t,e,s,i){this.load(t,new Promise((o=>{let n=new Image;n.onload=()=>{o({key:t,image:n,path:e,frameWidth:s,frameHeight:i})},n.src=e})))}getAsset(t){return this.assets[t]}loaded(){return Promise.all(Object.values(this.assets))}}class h extends o{constructor(){super("InputHandler"),this.keys={},this.mouse={x:0,y:0,left:!1,middle:!1,right:!1},document.body.addEventListener("contextmenu",(t=>{t.preventDefault()})),document.body.addEventListener("mousedown",(t=>{0===t.button?this.mouse.left=!0:1===t.button?this.mouse.middle=!0:2===t.button&&(this.mouse.right=!0)})),document.body.addEventListener("mouseup",(t=>{0===t.button?this.mouse.left=!1:1===t.button?this.mouse.middle=!1:2===t.button&&(this.mouse.right=!1)})),document.body.addEventListener("mousemove",(t=>{this.mouse.x=t.clientX,this.mouse.y=t.clientY})),document.body.addEventListener("keydown",(t=>{t.getModifierState("CapsLock")?this.keys[t.key.toLowerCase()]=!0:this.keys[t.key]=!0})),document.body.addEventListener("keyup",(t=>{t.getModifierState("CapsLock")?this.keys[t.key.toLowerCase()]=!1:this.keys[t.key]=!1}))}}function r(t,e){let s=Math.abs(t.x-e.x),i=Math.abs(t.y-e.y);return Math.sqrt(s*s+i*i)}function l(t,e){if(t.length>0)for(let s=0;s<t.length;s++)x(t[s],e)||e.push(t[s])}function a(t){let e=t;return e.sort(((t,e)=>t.t>e.t?1:t.t<e.t?-1:void 0)),e}function c(t){let e=[],s=t.length;for(let i=0;i<s;i++)e.push([{x:t[i%s].x,y:t[i%s].y},{x:t[(i+1)%s].x,y:t[(i+1)%s].y}]);return e}function d(t,e){let s=t[0].x,i=t[1].x,o=e[0].x,n=e[1].x,h=t[0].y,r=t[1].y,l=e[0].y,a=e[1].y,c=(n-o)*(h-l)-(a-l)*(s-o),d=(a-l)*(i-s)-(n-o)*(r-h),y=c/d,x=((i-s)*(h-l)-(r-h)*(s-o))/d,f=[];if(0===d&&0!==c||y<=0||y>=1||x<0||x>1)return f;if(0===c&&0===d){for(let o=0;o<2;o++){let n=u(e[o],t);if("ORIGIN"==n.loc||"DESTINATION"==n.loc)f.push({x:e[o].x,y:e[o].y,t:n.t});else if("BETWEEN"==n.loc){let t=+(s+n.t*(i-s)).toFixed(9),e=+(h+n.t*(r-h)).toFixed(9);f.push({x:t,y:e,t:n.t})}}return f}{for(let s=0;s<2;s++){let i=u(e[s],t);"ORIGIN"!=i.loc&&"DESTINATION"!=i.loc||f.push({x:e[s].x,y:e[s].y,t:i.t})}if(f.length>0)return f;let o=+(s+y*(i-s)).toFixed(9),n=+(h+y*(r-h)).toFixed(9);return f.push({x:o,y:n,t:y}),f}}function u(t,e){let s=e[1].x-e[0].x,i=e[1].y-e[0].y,o=t.x-e[0].x,n=t.y-e[0].y,h=s*n-o*i;if(t.x===e[0].x&&t.y===e[0].y)return{loc:"ORIGIN",t:0};if(t.x===e[1].x&&t.y===e[1].y)return{loc:"DESTINATION",t:1};let r,l=(y([e[1],e[0]])-y([{x:e[1].x,y:e[1].y},{x:t.x,y:t.y}]))%360;return l<0&&(l+=360),h<-1e-9?{loc:"LEFT",theta:l}:h>1e-9?{loc:"RIGHT",theta:l}:s*o<0||i*n<0?{loc:"BEHIND",theta:l}:Math.sqrt(s*s+i*i)<Math.sqrt(o*o+n*n)?{loc:"BEYOND",theta:l}:(r=0!==s?o/s:n/i,{loc:"BETWEEN",t:r})}function y(t){let e=t[1].x-t[0].x,s=t[1].y-t[0].y;if(0===e&&0===s)return!1;if(0===e)return s>0?90:270;if(0===s)return e>0?0:180;let i=360*Math.atan(s/e)/(2*Math.PI);return e>0?s>=0?i:i+360:i+180}function x(t,e){if(0===e.length)return!1;for(let s=0;s<e.length;s++)if(t.x===e[s].x&&t.y===e[s].y)return!0;return!1}function f(t,e){if(0===e.length)return!1;for(let s=0;s<e.length;s++)if(p(t,e[s]))return!0;return!1}function p(t,e){return t[0].x===e[0].x&&t[0].y===e[0].y&&t[1].x===e[1].x&&t[1].y===e[1].y||t[0].x===e[1].x&&t[0].y===e[1].y&&t[1].x===e[0].x&&t[1].y===e[0].y}function m(t,e){if(0===e.length)return!1;for(let s=0;s<e.length;s++)if(t.length===e[s].length)for(let i=0;i<t.length&&x(t[i],e[s]);i++)if(i===t.length-1)return!0;return!1}function g(t){let e=t.length,s=0;for(let i=0;i<e;i++)s+=Math.abs(t[i%e].x*t[(i+1)%e].y-t[i%e].y*t[(i+1)%e].x);return s/2}function w(t){let e,s,i=function(t){let e={x:{min:t[0].x,max:t[0].x},y:{min:t[0].y,max:t[0].y}};for(let s=1;s<t.length;s++)t[s].x<e.x.min&&(e.x.min=t[s].x),t[s].x>e.x.max&&(e.x.max=t[s].x),t[s].y<e.y.min&&(e.y.min=t[s].y),t[s].y>e.y.max&&(e.y.max=t[s].y);return e}(t),o=c(t),n=i.y.min+(i.y.max-i.y.min)/Math.PI,h=(i.y.max-i.y.min)/13,r=[],l=[],u=!1;for(;!u;){r=[{x:i.x.min-1,y:n},{x:i.x.max+1,y:n}];for(let t=0;t<o.length;t++)s=d(r,o[t]),s&&1===s.length&&l.push(s[0]);l=a(l);for(let t=0;t<l.length-1;t++)l[t].t!==l[t+1].t&&(u=!0,e={x:(l[t].x+l[t+1].x)/2,y:n});n+=h,(n>i.y.max||n<i.y.min)&&!1===u&&(u=!0,e=void 0)}return e}function v(t,e){let s,i,o,n=0,h=c(e);for(let e=0;e<h.length;e++)if([i,o]=h[e],s=u(t,[i,o]),("RIGHT"===s.loc&&i.y<t.y&&o.y>=t.y||"LEFT"===s.loc&&i.y>=t.y&&o.y<t.y)&&n++,"BETWEEN"===s.loc)return!1;return!!(n%2)}let b=0;function M(){return b++}const B={};class A extends o{constructor(t){super("Physics",t),this.bodies=[],this.friction=.8}update(){for(let t=0;t<this.bodies.length;t++){const e=this.bodies[t];for(let s=t+1;s<this.bodies.length;s++){const t=this.bodies[s],i=e.collides[t.uuid];if(i)if(e instanceof B.Group)if(t instanceof B.Group)for(const s of e.bodies)for(const e of t.bodies)B.collisionUpdate(s,e,i);else for(const s of e.bodies)B.collisionUpdate(s,t,i);else if(t instanceof B.Group)for(const s of t.bodies)B.collisionUpdate(e,s,i);else B.collisionUpdate(e,t,i)}}}render(){if(this.options.drawBodies)for(const t of this.bodies)if(t instanceof B.Group)for(const e of t.bodies)i(this.scene,e);else i(this.scene,t)}Detector([t,e],s){let i=t instanceof B.Group&&t||t.getBody(),o=e instanceof B.Group&&e||e.getBody();-1==this.bodies.indexOf(i)&&this.bodies.push(i),-1==this.bodies.indexOf(o)&&this.bodies.push(o);let n=(t,e,n)=>{let h=o instanceof B.Group&&n.parent||n,r=e,l=n;i===h&&(r=n,l=e),s(t,r,l)};i.collides[o.uuid]={body:o,cb:n},o.collides[i.uuid]={body:i,cb:n}}collidesWith([t,s]){this.Detector([t,s],((t,s,i)=>{let o=new B.Body(t[0]).getOffset();if(s.options&&s.options.Physics&&s.options.Physics.immovable){let t={x:Math.sign(i.AABB()[0].x-s.AABB()[0].x),y:Math.sign(i.AABB()[0].y-s.AABB()[0].y)},n=new e;n[o.key]=o.value*t[o.key],i.moveTo(e.sum(i.AABB()[0],n))}if(i.options&&i.options.Physics&&i.options.Physics.immovable){let t={x:Math.sign(s.AABB()[0].x-i.AABB()[0].x),y:Math.sign(s.AABB()[0].y-i.AABB()[0].y)},n=new e;n[o.key]=o.value*t[o.key],s.moveTo(e.sum(s.AABB()[0],n))}}))}}B.Body=class{constructor(t=[],s){this.uuid=M(),this.rvecs=t,this.vecs=t,this.options=s,this.angle=0,this.velocity=new e,this.collides={}}update(){if(this.owner instanceof k){let t=this.AABB(),s=t[0],i=t[2],o=(s.x+i.x)/2,n=(s.y+i.y)/2;this.rotateTo(this.owner.angle,new e(o,n))}this.velocity.x*=this.manager.friction,this.velocity.y*=this.manager.friction,Math.abs(this.velocity.x)<.1&&(this.velocity.x=0),Math.abs(this.velocity.y)<.1&&(this.velocity.y=0);for(let t=0;t<this.vecs.length;t++){const e=this.vecs[t];e.x+=this.velocity.x,e.y+=this.velocity.y}}rotate(t=new Angle,s=new e){for(let e=0;e<this.vecs.length;e++)this.vecs[e].rotate(t,s)}rotateTo(t=new Angle,s=new e){t-this.angle!=Number.EPSILON&&(this.rotate(t-this.angle,s),this.angle=t)}remove(){this.parent&&this.parent.bodies.indexOf(this)>-1&&this.parent.bodies.splice(this.parent.bodies.indexOf(this),1)}moveTo(t){let s=[];for(let i=0;i<this.rvecs.length;i++){const o=this.rvecs[i];s[i]=e.sum(o,t)}this.vecs=s}getOffset(){let t=1/0,e=1/0,s=-1/0,i=-1/0;for(const o of this.vecs)o.x<t&&(t=o.x),o.y<e&&(e=o.y),o.x>s&&(s=o.x),o.y>i&&(i=o.y);const o=s-t,n=i-e;return o<n?{key:"x",value:o}:{key:"y",value:n}}AABB(){let t=1/0,s=1/0,i=-1/0,o=-1/0;for(const e of this.vecs)e.x<t&&(t=e.x),e.y<s&&(s=e.y),e.x>i&&(i=e.x),e.y>o&&(o=e.y);return[new e(t,s),new e(i,s),new e(i,o),new e(t,o)]}},B.Body.Square=class extends B.Body{constructor(t,s){super([new e(0,0),new e(t,0),new e(t,t),new e(0,t)],s)}},B.collides=(t,e)=>function(t,e){for(let e=0;e<t.length;e++)t[e].x=+t[e].x.toFixed(9),t[e].y=+t[e].y.toFixed(9);for(let t=0;t<e.length;t++)e[t].x=+e[t].x.toFixed(9),e[t].y=+e[t].y.toFixed(9);let s=function(t,e){for(let s=0;s<t.length;s++)for(let i=0;i<e.length;i++)r(t[s],e[i])<1e-8&&(t[s]=e[i]);return t}(e,t);if(!function(t,e){let s=[t,e];for(let t=0;t<s.length;t++)if(s[t].length<3)return console.error("Polygon "+(t+1)+" is invalid!"),!1;return!0}(t,s))return!1;let i=function(t,e){let s=c(t).concat(c(e)),i=[];for(let t=0;t<s.length;t++){let e=[];for(let i=0;i<s.length;i++)t!=i&&l(d(s[t],s[i]),e);let o=s[t][0];o.t=0;let n=s[t][1];n.t=1,l([o,n],e),e=a(e);for(let t=0;t<e.length-1;t++){let s=[{x:e[t].x,y:e[t].y},{x:e[t+1].x,y:e[t+1].y}];f(s,i)||i.push(s)}}return i}(t,s),o=function(t){let e=[],s=[],i=t.length,o=function(t){let e,s,i=[];for(let o=0;o<t.length;o++)e=(t[o][0].x+t[o][1].x)/2,s=(t[o][0].y+t[o][1].y)/2,"BETWEEN"!=u({x:e,y:s},t[o]).loc&&console.error("Midpoint calculation error"),i.push({x:e,y:s});return i}(t);for(let n=0;n<i-2;n++){let h,r,l,a,c={x:t[n][0].x,y:t[n][0].y},d={x:t[n][1].x,y:t[n][1].y},y=n;for(l=0;l<2;l++){for(s=[],a=!1;0===s.length||!a;){s.push({x:c.x,y:c.y}),h=void 0;for(let e=0;e<i;e++)if(r=void 0,!p(t[e],t[y])&&(t[e][0].x===d.x&&t[e][0].y===d.y&&(r=t[e][1]),t[e][1].x===d.x&&t[e][1].y===d.y&&(r=t[e][0]),r)){let t=u(r,[c,d]);(!h||t.theta<h.theta&&0===l||t.theta>h.theta&&1===l)&&(h={x:r.x,y:r.y,theta:t.theta,edge:e})}if(c.x=d.x,c.y=d.y,d.x=h.x,d.y=h.y,y=h.edge,p([c,d],t[n])){a=!0;for(let t=0;t<o.length;t++)v(o[t],s)&&(s=!1)}}s&&!m(s,e)&&e.push(s)}}return e}(i),n=function(t,e,s,i){let o,n,h,r=[],l=function(t,e){let s=[];for(let e=0;e<t.length;e++)g(t[e])>=1e-4&&s.push(t[e]);return s}(t);for(let t=0;t<l.length;t++)h=w(l[t]),o=v(h,e),n=v(h,s),o&&n&&r.push(l[t]);return r}(o,t,s);return n}(t.vecs,e.vecs),B.AABBcollides=(t,e)=>{let s=t.AABB(),i=e.AABB();return s[0].x<i[2].x&&s[2].x>i[0].x&&s[0].y<i[2].y&&s[2].y>i[0].y},B.collisionUpdate=(t,e,s)=>{if(B.AABBcollides(t,e)){let i=B.collides(t,e);i.length>0&&s.cb(i,t,e)}},B.Group=class{constructor(){this.uuid=M(),this.collides={},this.bodies=[]}add(t){t.parent=this,this.bodies.push(t)}};class T extends class extends class{constructor(t,s=new e){this.scene=t,this.scene.objects.push(this),this.position=s}remove(){this.scene.objects.indexOf(this)>-1&&this.scene.objects.splice(this.scene.objects.indexOf(this),1)}render(){}}{constructor(t,s,i=new e){super(t,i),this.key=s,this.asset=t.Modules.AssetLoader.getAsset(s),this.anchor=new e(0,0),this.width=this.asset.image.width,this.height=this.asset.image.height}cull(){return!1}update(){}render(){void 0!==this.angle?(this.scene.ctx.save(),this.scene.ctx.translate(this.position.x-this.anchor.x*this.width,this.position.y-this.anchor.y*this.height),this.scene.ctx.rotate(this.angle),this.scene.ctx.drawImage(this.asset.image,0,0),this.scene.ctx.restore()):this.scene.ctx.drawImage(this.asset.image,this.position.x-this.anchor.x*this.width,this.position.y-this.anchor.y*this.height)}}{constructor(t,s,i=new e,o={}){super(t,s,i),this.anchor=o.anchor||this.anchor,this.body=new B.Body.Square(this.asset.image.width,o),this.body.manager=t.Modules.Physics,this.body.parent=t.Modules.Physics,this.body.owner=this,this.body.moveTo(new e(this.position.x-this.anchor.x*this.width,this.position.y-this.anchor.y*this.height))}remove(){this.body.remove(),super.remove()}getBody(){return this.body}collides(){}update(){this.body.update()}render(){let t=this.body.vecs[0];this.position.x=t.x+this.anchor.x*this.width,this.position.y=t.y+this.anchor.y*this.height,super.render()}}class k extends T{constructor(t,s=new e,i=0){super(t,"player",s,{anchor:new e(.5,.5)}),this.angle=i,this.speed=10,this.distance=0,this.lifeSpan=500}update(){let t=Math.cos(this.angle)*this.speed,s=Math.sin(this.angle)*this.speed;this.body.velocity=new e(t,s),this.distance+=Math.sqrt(t*t+s*s),this.distance>this.lifeSpan&&this.remove(),super.update()}}class I extends T{constructor(t,s=new e){super(t,"player",s,{anchor:new e(.5,.5)}),this.fireRate=100,this.lastFire=0,this.velocity=.6,this.bulletsPhysicsGroup=new B.Group}move(t=new e){let s=this.getBody();s.velocity=e.sum(s.velocity,t)}update(){if(super.update(),this.scene.Modules.InputHandler&&(this.scene.Modules.InputHandler.keys.w&&this.move(new e(0,-this.velocity)),this.scene.Modules.InputHandler.keys.s&&this.move(new e(0,this.velocity)),this.scene.Modules.InputHandler.keys.a&&this.move(new e(-this.velocity,0)),this.scene.Modules.InputHandler.keys.d&&this.move(new e(this.velocity,0)),this.scene.Modules.InputHandler.mouse.left&&Date.now()-this.lastFire>this.fireRate)){let t=new k(this.scene,this.position.clone(),this.position.angleBetween(new e(this.scene.Modules.InputHandler.mouse.x,this.scene.Modules.InputHandler.mouse.y)));this.bulletsPhysicsGroup.add(t.getBody()),this.lastFire=Date.now()}}}class E{constructor(t){this.tiles=[],this.rawData=t,this.group=new B.Group,this.spawn=new e}loadToScene(t){for(let s=0;s<this.rawData.width;s++)for(let i=0;i<this.rawData.height;i++){const o=this.rawData.tiles[s][i];if(o&&o.key){const n=t.Modules.AssetLoader.getAsset(o.key);let h=new T(t,o.key,new e(s*n.frameWidth,i*n.frameHeight),{Physics:{immovable:!0}});this.group.add(h.getBody()),this.tiles.push(h)}o&&o.data&&"spawn"===o.data&&(this.spawn=new e(32*s,32*i))}}loadToSceneRandom(t){this.spawn.x=16*Math.floor(Math.random()*t.canvas.width/16),this.spawn.y=16*Math.floor(Math.random()*t.canvas.height/16);for(let s=0;s<t.canvas.width/16;s++)for(let i=0;i<t.canvas.height/16;i++)if(s!=this.spawn.x&&i!=this.spawn.y&&Math.random()>.99){let o=new T(t,"player",new e(16*s,16*i));this.group.add(o.getBody()),this.tiles.push(o)}}}document.addEventListener("DOMContentLoaded",(async()=>{(async()=>{let t=new s({backgroundColor:"rgba(33, 33, 33, 1)"});const i=t.useModule(new n);t.useModule(new h);const o=t.useModule(new A({}));i.loadSprite("tile","assets/tile.png",32,32),i.loadSprite("player","assets/player.png",16,16),await i.loaded();let r={width:20,height:18,tiles:new Array(20)};for(let t=0;t<20;t++){r.tiles[t]=new Array(18);for(let e=0;e<18;e++)0!==t&&0!==e&&19!==t&&17!==e||(r.tiles[t][e]={key:"tile"})}let l=1+Math.floor(18*Math.random()),a=1+Math.floor(16*Math.random());r.tiles[l][a]={data:"spawn"};let c=new E(r);c.loadToScene(t),console.log(c.spawn);let d=new I(t,new e(48,48));o.collidesWith([d,c.group]),o.Detector([d.bulletsPhysicsGroup,c.group],((t,e,s)=>{e.owner.remove()}));let u=new B.Group,y=(s=100)=>{if(u.bodies.length<5){let i=s*Math.sqrt(Math.random()),o=2*Math.random()*Math.PI,n=d.position.x+i*Math.cos(o),h=d.position.y+i*Math.sin(o);if(n>0&&n<640&&h>0&&h<576){let s=new T(t,"player",new e(n,h));u.add(s.getBody())}else y()}};o.Detector([d.bulletsPhysicsGroup,u],((t,e,s)=>{e.owner.remove(),s.owner.remove(),y()})),o.Detector([u,c.group],((t,e,s)=>{e.owner.remove(),y()}));let x=0;t.update=()=>{Date.now()-x>1e3&&(y(),x=Date.now())}})()}))})();