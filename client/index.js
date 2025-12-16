
const socket = io("https://YOUR-RAILWAY-URL.up.railway.app");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let me = { x: 100, y: 100 };
const others = {};

socket.on("currentPlayers", (players) => {
  for (let id in players) if (id !== socket.id) others[id] = players[id];
});

socket.on("newPlayer", (p) => others[p.id] = p);
socket.on("playerMoved", (p) => others[p.id] = p);
socket.on("playerLeft", (id) => delete others[id]);

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") me.y -= 5;
  if (e.key === "ArrowDown") me.y += 5;
  if (e.key === "ArrowLeft") me.x -= 5;
  if (e.key === "ArrowRight") me.x += 5;
  socket.emit("move", me);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(me.x, me.y, 20, 20);
  for (let id in others) {
    const p = others[id];
    ctx.fillRect(p.x, p.y, 20, 20);
  }
  requestAnimationFrame(draw);
}
draw();
