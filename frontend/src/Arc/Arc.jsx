import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const Arc = ({ innerRadius, outerRadius, startAngle, endAngle, width, height }) => {
  const ref = useRef();
  const backgroundColorArc = '#E6DDD4';
  const scoreColorArc = '#889D35';
  
  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Clear previous content
    svg.selectAll('*').remove();

    // Background arc (full circle)
    const backgroundArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI); // Full circle

    svg.append('path')
      .attr('d', backgroundArc)
      .attr('fill', backgroundColorArc)
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Foreground arc (partial)
    const foregroundArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg.append('path')
      .attr('d', foregroundArc)
      .attr('fill', scoreColorArc)
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  }, [innerRadius, outerRadius, startAngle, endAngle, width, height]);

  return (
    <svg ref={ref}></svg>
  );
};

Arc.propTypes = {
  innerRadius: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  startAngle: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Arc;