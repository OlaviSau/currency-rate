"use strict";
import { render } from "react-dom";
import { createElement, Component, createRef } from "react";
import { select } from "d3";
import { get } from "axios";

import "./historical.css";

class HistoricalRateGraph extends Component {
  constructor(props) {
    super(props);
    this.from = createRef();
    this.to = createRef();

  }

  componentDidMount() {
    this.from.current.value = "2019-01-01";
    this.to.current.value = "2019-05-25";
  }

  fetchRates() {
    get(`http://localhost:3000/historical?start_at=${this.from.current.value}&end_at=${this.to.current.value}`).then(
      ({data: rates}) => this.setState({rates})
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const rates = this.state.rates.map(dailyRate => dailyRate.rate);
    const width = 900 / rates.length;
    const base = Math.min(...rates);
    const top = Math.max(...rates);
    const ratio = 300 / (top - base);
    select("#graph_container").selectAll("rect").remove();

    select("#graph_container")
      .selectAll("rect")
      .data(rates)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * width )
      .attr("y", d => 450 - ratio * (d - base))
      .attr("width", width - 1)
      .attr("height", d => (d - base) * ratio)
      .attr("fill", "#adbce6")
  }

  render() {
    return (
      <div>
        <label>
          From
          <input ref={this.from} type="text" placeholder="yyyy-mm-dd"/>
        </label>
        <label>
          To
          <input ref={this.to} type="text" placeholder="yyyy-mm-dd"/>
        </label>
        <button onClick={() => this.fetchRates()}>Update</button>
        <svg id="graph_container" width="900" height="450"/>
      </div>
    );
  }
}

render(
  createElement(HistoricalRateGraph),
  document.querySelector("#historical")
);
