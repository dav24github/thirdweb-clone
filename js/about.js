const members = document.querySelector(".members__wrapper");
const membersClone = members.cloneNode(true);

const membersWith = members.getBoundingClientRect().width;

while (
  members.getBoundingClientRect().width <=
  2 * document.documentElement.clientWidth
) {
  Array.from(membersClone.children).forEach((member) => {
    const clone = member.cloneNode(true);
    members.appendChild(clone);
  });
}

let offset = 0;
const speed = 1;

function moveInfinite() {
  offset += speed;
  members.style.transform = `translateX(-${offset}px)`;

  if (offset === membersWith + 40) {
    offset = 0;
  }
}
setInterval(moveInfinite, 20);
