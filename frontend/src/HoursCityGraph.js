import React, { Component } from  'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import store from './reducers';

import Recharts, { Label, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';


const HoursGraph = createReactClass({

  componentDidMount: function() {
    store.dispatch({
      type: 'SET_CHART',
      chart: { data: this.props.weatherHourly }
    });
  },

  getAxisYDomain: function(from, to, ref, offset){
	  const refData = this.props.weatherHourly.slice(from-1, to);
    let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
    refData.forEach( d => {
  	  if ( d[ref] > top ) top = d[ref];
      if ( d[ref] < bottom ) bottom = d[ref];
    });
  
    return [ (bottom|0) - offset, (top|0) + offset ]
  },
  
  zoom: function(){ 
    var self = this;
    let { refAreaLeft, refAreaRight, data } = this.props.chart;

    if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
      store.dispatch({
        type: 'SET_CHART',
        chart: { reAreaLeft : '', refAreaRight : '' }
      });
      return;
    }

    // xAxis domain
    if ( refAreaLeft > refAreaRight ) [ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

    // yAxis domain
    const [ bottom, top ] = self.getAxisYDomain( refAreaLeft, refAreaRight, 'temp', 0 );
    const [ bottom2, top2 ] = self.getAxisYDomain( refAreaLeft, refAreaRight, 'feels_like', 0 );

    store.dispatch({
      type: 'SET_CHART',
      chart: {
        refAreaLeft : '',
        refAreaRight : '',
        data : this.props.weatherHourly.slice(),
        left : refAreaLeft,
        right : refAreaRight,
        bottom, top, bottom2, top2
      }
    });
  },

  zoomOut: function() {
    store.dispatch({
      type: 'SET_CHART',
      chart: {
        data : this.props.weatherHourly.slice(),
        refAreaLeft : '',
        refAreaRight : '',
        left : 'dataMin',
        right : 'dataMax',
        top : 'dataMax+1',
        bottom : 'dataMin',
        top2 : 'dataMax+50',
        bottom: 'dataMin+50'
      }
    });
  },
  
  render: function() {
    const { data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = this.props.chart;

    return (
      <div className="highlight-bar-charts">
        <a
          href="javascript: void(0);"
          className="btn update"
          onClick={this.zoomOut.bind( this )}
        >
          Zoom Out
        </a>

        <p>Highlight / Zoom - able Line Chart</p>
          <LineChart
            width={800}
            height={400}
            data={data}
            onMouseDown = { (e) => store.dispatch({ type: 'SET_CHART', chart: { refAreaLeft:e.activeLabel } }) }
            onMouseMove = { (e) => this.props.chart.refAreaLeft && store.dispatch({ type: 'SET_CHART', chart: { refAreaRight:e.activeLabel } }) }
            onMouseUp = { this.zoom.bind( this ) }
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis 
              allowDataOverflow={true}
              dataKey="dt"
              domain={[left, right]}
              type="number"
            />
            <YAxis 
              allowDataOverflow={true}
              domain={[bottom, top]}
              type="number"
              yAxisId="1"
             />
            <YAxis 
              orientation="right"
              allowDataOverflow={true}
              domain={[bottom2, top2]}
              type="number"
              yAxisId="2"
             /> 
            <Tooltip/>
            <Line name='# Temperature, K' yAxisId="1" type='natural' dataKey='temp' stroke='#8884d8' animationDuration={300}/>
            <Line name='# Feels like, K' yAxisId="2" type='natural' dataKey='feels_like' stroke='#82ca9d' animationDuration={300}/>
            
            {
              (refAreaLeft && refAreaRight) ? (
                <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> 
              ) : null
            }            
          </LineChart> 
      </div>
    );
  }
});

const mapStateToProps = function(store) {
  return {
      chart: store.cityState.chart,
      weatherHourly: store.weatherState.weatherHourly,
  };
}

export default connect(mapStateToProps)(HoursGraph);