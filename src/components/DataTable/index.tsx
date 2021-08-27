import { useState } from 'react';
import Chart from 'react-google-charts';

import './table.scss';

export interface TestData {
    id: number;
    test: string;
    qtdMaterial: number;
};

interface FormData {
    id: number;
    testId: { id: number; };
    sieveName: string;
    openingSieve: string;
    tare: number;
    tareMaterial: number;
}

const DataTable = () => {

    const [useId, setUseId] = useState(0);

    const testData: TestData[] = JSON.parse(String(localStorage.getItem('test'))) || [];
    const formData: FormData[]  = JSON.parse(String(localStorage.getItem('formData'))) || [];
    const selectDataForId = formData?.filter(item => {
        if(item.testId.id === useId){
            return item;
        }
    });
    const calcMaterialResult = selectDataForId.map(item => {
        const solids = item.tareMaterial - item.tare
        return Number(solids.toFixed(2));
    });

    console.log(calcMaterialResult)

    const mockData = {

        options: {
            title: 'Abertura vs. % Retido Acumulada',
            hAxis: { title: 'Abertura', logScale: true },
            vAxis: { title: '% Retido Acumulada', direction: '-1' },
            legend: 'none',
        },
        xaxis: {
            title: 'Abertura',
        },
        yaxis: {
            title: '%RetidoAcumulado',
        },
    }

    return (
        <div className="container">
            <div className="title">
                <h1>Dashboard Granulometria</h1>
                <h3>Gráfico da distribuição granulométrica</h3>

            </div>
            <div className="chart">
                <Chart
                    height={'300px'}
                    width={'500px'}
                    chartType="ScatterChart"
                    loader={<div>Loading Chart</div>}
                    options={mockData.options}
                    data={[
                        [mockData.xaxis.title, mockData.yaxis.title],
                        [8, 12],
                        [4, 5.5],
                        [11, 14],
                        [4, 5],
                        [3, 3.5],
                        [6.5, 7],
                    ]}
                    rootProps={{ 'data-testid': 1 }}
                />
            </div >

            <select
                className="selection" value={useId}
                onChange={e => setUseId(Number(e.target.value))}
            >
                <option value="" >Selecione o código desejado</option>
                {
                    testData?.map(el => {
                        return (
                            <option key={el.id} value={el.id}>{el.test}</option>
                        )
                    })
                }
            </select>

            <a className="button" href="/cadastrar-dados" >Novo +</a>
        </div>
    );
}

export default DataTable;