export default class ColumnChart {
  element;

  constructor({
    data = [],
    label = "",
    value = "",
    link = "",
    formatHeading = "",
  } = {}) {
    this.data = this.getColumnProps(data);
    this.label = label;
    this.value = value.toLocaleString("en-US");
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }

  columnBuilder(data) {
    return data
      .map(
        (elem) =>
          `<div style="--value: ${elem.value}" data-tooltip="${elem.percent}"></div>`
      )
      .join("");
  }
  
  linkBuilder() {
    return `<a href="${this.link}" class="column-chart__link">View all</a>`;
  }

  template() {
    return `
      <div class="column-chart ${
        this.data.length ? "" : "column-chart_loading"
      }" style="--chart-height: 50">
         <div class="column-chart__title">
         Total ${this.label}
         ${this.link ? this.linkBuilder() : ""} 
         </div>
         <div class="column-chart__container">
         <div data-element="header" class="column-chart__header">
         ${this.formatHeading ? this.formatHeading(this.value) : this.value}
         </div>
         <div data-element="body" class="column-chart__chart">
            ${this.columnBuilder(this.data)}
         </div>
         </div>
      </div>
   `;
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = this.template();
    const element = wrapper.firstElementChild;
    this.element = element;
  }

  update(data) {
    const columnsBody = this.element.querySelector("[data-element='body']");
    columnsBody.remove();
    const columns = this.columnBuilder(data);
    columnsBody.append(columns);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
