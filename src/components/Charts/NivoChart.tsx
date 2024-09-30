// src/components/Charts/NivoChart.tsx
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { format } from 'd3-format';


interface NivoChartProps {
    data: {
        MaterialCategory: string;
        MaterialType: string;
        MaterialTonsDisposed: number;
        MaterialTonsInCurbsideOrganics: number;
        MaterialTonsInCurbsideRecycle: number;
        MaterialTonsInOtherDiversion: number;
    }[],
    index: string;
}

// Define a mapping for your keys to human-readable labels
const labelMapping: { [key: string]: string } = {
    MaterialTonsDisposed: "Material Tons Disposed",
    MaterialTonsInCurbsideOrganics: "Material Tons in Curbside Organics",
    MaterialTonsInCurbsideRecycle: "Material Tons in Curbside Recycle",
    MaterialTonsInOtherDiversion: "Material Tons in Other Diversion",
};

const NivoChart: React.FC<NivoChartProps> = ({ data, index }) => {
    console.log("Nivo Chart indexed by:", index, data);

    // Sort the data by total disposed in descending order
    const sortedData = data.sort((a, b) =>
        (b.MaterialTonsDisposed - a.MaterialTonsDisposed) +
        (b.MaterialTonsInCurbsideOrganics - a.MaterialTonsInCurbsideOrganics) +
        (b.MaterialTonsInCurbsideRecycle - a.MaterialTonsInCurbsideRecycle) +
        (b.MaterialTonsInOtherDiversion - a.MaterialTonsInOtherDiversion));

    const indexString = index === "MaterialCategory" ? "Material Category" : "Material Type";

    return (
        <div style={{ height: 400, position: 'relative' }}>
            <ResponsiveBar
                data={sortedData}
                keys={Object.keys(labelMapping)}
                indexBy={index}
                margin={{ top: 20, right: 200, bottom: 100, left: 75 }}
                padding={0.3}
                enableLabel={false}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -30,
                    legend: indexString,
                    legendPosition: 'middle',
                    legendOffset: 75
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Amount of Resources (tons)',
                    legendPosition: 'middle',
                    legendOffset: -50,
                    format: format(".2s"),
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                }}
                valueFormat={(value) => format(".2s")(value)}
                tooltip={({ id, value, indexValue }) => (
                    <div style={{padding: '12px', color:'black',
                                 background:'white', opacity:0.85,
                                 borderRadius: 10, borderColor:'black',
                                 borderWidth:2}}>
                        <ul>
                            <li>{indexString}: {indexValue}</li>
                            <li>Amount of Resources (tons): {format(".2s")(value)}</li>
                            <li>Type of Disposal: {labelMapping[id]} </li>
                        </ul>
                    </div>
                )}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'top-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Data Visualization"
                barAriaLabel={e => `${labelMapping[e.id]}: ${e.formattedValue} in county: ${e.indexValue}`}
            />
        </div>
    );
};

export default NivoChart;
