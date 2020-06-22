import React from    'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import store from './reducers';

import Recharts, { ResponsiveContainer, Label, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';


const HistoryGraph = createReactClass({

    componentDidMount: function() {
        store.dispatch({
            type: 'SET_HISTORY_CHART_DATA',
            data: this.props.weatherHistory
        });
    },

    getAxisYDomain: function(from, to, key, ref, offset){
        var from_index;
        var to_index;
        console.log(this.props.data);
        for (const [i, value] of this.props.data.entries()) {
            if (value[key] == from) {
                from_index = i;
            }
            if (value[key] == to) {
                to_index = i;
            }
        }
        console.log([from_index, to_index]);
        const refData = this.props.data.slice(from_index - 1, to_index);
        console.log(refData);
        let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
        refData.forEach( d => {
    	    if ( d[ref] > top ) top = d[ref];
            if ( d[ref] < bottom ) bottom = d[ref];
        });
    
        return [ (bottom|0) - offset, (top|0) + offset ]
    },
    
    zoom: function(){ 
        var self = this;
        let { refAreaLeft, refAreaRight } = this.props;

        if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
            store.dispatch({
                type: 'SET_HISTORY_CHART_REFS',
                refAreaLeft : '', 
                refAreaRight : ''
            });
            return;
        }

        // xAxis domain
        if ( refAreaLeft > refAreaRight ) [ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

        // yAxis domain
        let [ bottom, top ] = self.getAxisYDomain( refAreaLeft, refAreaRight, 'dt', 'temp', 1 );
        let [ bottom2, top2 ] = self.getAxisYDomain( refAreaLeft, refAreaRight, 'dt', 'feels_like', 1 );

        if (bottom > bottom2) bottom = bottom2;
        if (top < top2) top = top2;

        store.dispatch({
            type: 'SET_HISTORY_CHART',
            refAreaLeft : '',
            refAreaRight : '',
            data : this.props.weatherHistory.slice(),
            left : refAreaLeft,
            right : refAreaRight,
            bottom, top, bottom2, top2
        });
    },

    zoomOut: function() {
        store.dispatch({
            type: 'SET_HISTORY_CHART',
            data : this.props.weatherHistory.slice(),
            refAreaLeft : '',
            refAreaRight : '',
            left : 'dataMin',
            right : 'dataMax',
            top : 'dataMax+1',
            bottom : 'dataMin-1',
            top2 : 'dataMax+1',
            bottom2: 'dataMin-1'
        });
    },

    addZero: function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },

    unixTimeToUTC: function(unixTime) {
        var date = new Date(unixTime * 1000);
        var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var timeStr = this.addZero(date.getUTCHours()) + ":" + this.addZero(date.getUTCMinutes());
        var dateTime = 'UTC ' + dateStr + ' ' + timeStr;
        return dateTime;
    },

    unixTimeToUTCwithDate: function(unixTime) {
        var date = new Date(unixTime * 1000);
        var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var timeStr = this.addZero(date.getUTCHours()) + ":" + this.addZero(date.getUTCMinutes());
        var dateTime = 'UTC ' + dateStr + ' ' + timeStr;
        return dateTime;
    },

    kelvinToCeisium: function(kelvin) {
        return (kelvin - 273).toFixed(0);
    },

    CustomTooltip:function({ payload, label, active }) {
        if (active) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{ this.unixTimeToUTCwithDate(label) }</p>
                    <p className="tooltip-data"> Temp: { (payload[0].value - 273).toFixed(2) } &deg;C</p>
                    <p className="tooltip-data"> Feels like: { (payload[1].value - 273).toFixed(2) } &deg;C</p>
                </div>
            );
        }

        return null;
    },
    
    render: function() {
        const { data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = this.props;

        return (
            <div>
                <div className="highlight-bar-charts">
                    <ResponsiveContainer width='100%' aspect={16.0/9.0}>
                        <LineChart
                            margin={{ top: 20, right: -30, left: -30, bottom: 0 }}
                            data={data}
                            onMouseDown = { (e) => e != null && store.dispatch({ type: 'SET_HISTORY_CHART_REF_LEFT', refAreaLeft: e.activeLabel }) && console.log(e) }
                            onMouseMove = { (e) => e != null && this.props.refAreaLeft && store.dispatch({ type: 'SET_HISTORY_CHART_REF_RIGHT', refAreaRight: e.activeLabel }) && console.log(e) }
                            onMouseUp = { this.zoom }
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis 
                                allowDataOverflow={true}
                                dataKey="dt"
                                domain={[left, right]}
                                type="number"
                                scale="time"
                                tickFormatter={(tick) => this.unixTimeToUTC( tick ) }
                            />
                            <YAxis 
                                allowDataOverflow={true}
                                domain={[bottom, top]}
                                type="number"
                                yAxisId="1"
                                tickFormatter={(tick) => this.kelvinToCeisium( tick ) }
                                scale="linear"
                                />
                            <Tooltip content={<this.CustomTooltip />} />
                            <Line name='# Temperature, K' yAxisId="1" dataKey='temp' stroke='#8884d8' animationDuration={100}/>
                            <Line name='# Feels like, K' yAxisId="1" dataKey='feels_like' stroke='#82ca9d' animationDuration={100}/>
                            
                            {
                                (refAreaLeft && refAreaRight) ? (
                                    <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} /> 
                                ) : null
                            }                        
                        </LineChart> 
                    </ResponsiveContainer>
                </div>
                <button href="#" className="btn update" onClick={ this.zoomOut } >
                    Zoom Out
                </button>
            </div>
        );
    }
});

const mapStateToProps = function(store) {
    return {
            data: store.historyChartState.data,
            left : store.historyChartState.left,
            right : store.historyChartState.right,
            refAreaLeft : store.historyChartState.refAreaLeft,
            refAreaRight : store.historyChartState.refAreaRight,
            top : store.historyChartState.top,
            bottom : store.historyChartState.bottom,
            top2 : store.historyChartState.top2,
            bottom2: store.historyChartState.bottom2,
            animation : store.historyChartState.true,
            weatherHistory: store.weatherState.weatherHistory,
    };
}

export default connect(mapStateToProps)(HistoryGraph);