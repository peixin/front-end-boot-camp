import { createElement, Component } from "./framework";

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
    this.root = this.root = document.createElement("div");
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root.classList.add("carousel");
    for (let index in this.attributes.src) {
      const record = this.attributes.src[index];
      const img = document.createElement("div");

      img.innerText = index;
      img.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(img);
    }

    const children = this.root.children;

    let startX;
    let position = 0;

    const onDown = (event) => {
      startX = event.clientX;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    const onMove = (event) => {
      const x = event.clientX - startX;
      for (let child of children) {
        child.style.transition = "none";
        child.style.transform = `translateX(${x - position * 500}px)`;
      }
    };

    const onUp = (event) => {
      const x = event.clientX - startX;
      position = position - Math.round(x / 500);

      for (let child of children) {
        child.style.transition = "";
        child.style.transform = `translateX(${-position * 500}px)`;
      }
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    this.root.addEventListener("mousedown", onDown);

    // let currentIndex = 0;

    // setInterval(() => {
    //   const nextIndex = (currentIndex + 1) % children.length;

    //   const current = children[currentIndex];
    //   const next = children[nextIndex];

    //   next.style.transition = "none";
    //   next.style.transform = `translateX(${100 - 100 * nextIndex}%)`;

    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 * (currentIndex + 1)}%)`;
    //     next.style.transform = `translateX(${-100 * nextIndex}%)`;

    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 1000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

const images = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

const rootElement = <Carousel id="carousel" src={images}></Carousel>;

rootElement.mountTo(document.body);
