import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  maxValue?: number;
  title?: string;
  showGrid?: boolean;
  showAxes?: boolean;
  showLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  title,
  showGrid = true,
  showAxes = true,
  showLegend = true
}) => {
  const maxDataValue = maxValue || Math.max(...data.map(d => d.value));
  const maxYValue = Math.ceil(maxDataValue / 10) * 10; // Round up to nearest 10
  
  // Generate Y-axis scale values
  const yAxisValues = [];
  for (let i = 0; i <= maxYValue; i += 10) {
    yAxisValues.push(i);
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      )}
      
      <div className="relative w-full max-w-4xl">
        {/* Chart container */}
        <div className="relative h-80 ml-12 mr-8 mt-8">
          {/* Y-axis labels */}
          {showAxes && (
            <div className="absolute -left-12 top-0 bottom-0 w-10 flex flex-col justify-between text-right">
              {[...yAxisValues].reverse().map((value) => (
                <span key={value} className="text-xs text-gray-600 -translate-y-1/2">
                  {value}
                </span>
              ))}
            </div>
          )}
          
          {/* Grid lines */}
          {showGrid && yAxisValues.map((value) => (
            <div
              key={`grid-${value}`}
              className="absolute left-0 right-0 border-t border-gray-200"
              style={{ bottom: `${(value / maxYValue) * 100}%` }}
            />
          ))}
          
          {/* Y-axis line */}
          {showAxes && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-800"></div>
          )}
          
          {/* X-axis line */}
          {showAxes && (
            <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-800"></div>
          )}
          
          {/* Bars container */}
          <div className="relative flex justify-around items-end h-full">
            {data.map((item) => {
              const barHeightPercent = (item.value / maxYValue) * 100; // Height as percentage of container

              return (
                <div key={item.label} className="flex flex-col items-center">
                  {/* Value label above bar */}
                  <div 
                    className="absolute text-sm font-medium text-gray-800"
                    style={{ bottom: `${barHeightPercent}%` }}
                  >
                    {item.value}
                  </div>
                  
                  {/* Bar */}
                  <div
                    className="w-12 hover:opacity-80 transition-opacity cursor-pointer absolute bottom-0.5"
                    style={{
                      height: `${barHeightPercent}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* X-axis labels */}
        {showAxes && (
          <div className="flex justify-around ml-12 mr-8">
            {data.map((item) => (
              <div key={`label-${item.label}`} className="flex-1 text-sm font-medium text-red-500 text-center">
                [{item.label}]
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {data.map((item) => (
            <div key={`legend-${item.label}`} className="flex items-center gap-2">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};