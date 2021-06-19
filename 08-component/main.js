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
    for (let record of this.attributes.src) {
      const img = document.createElement("div");
      img.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(img);
    }

    let current = 0;
    setInterval(() => {
      const children = this.root.children;
      current++;
      current %= children.length;
      for (let child of children) {
        child.style.transform = `translateX(${-100 * current}%)`;
      }
    }, 1000);

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
