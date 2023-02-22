import React from "react";
import * as App from 'App';
import * as Manki from 'api/manki';
import Swal from 'sweetalert2';
import './CarTable.css';

function CarTable() {
    const carstatus = React.useContext(App.adminDataContext).carstatus as Manki.CarInfo[];
    const adminId = React.useContext(App.adminDataContext).adminId as Manki.AdminId;
    function generateConfirmer (carId: Manki.CarId) {
        return async function () {
            const result = await Manki.manageCar(adminId, carId);
            if (result instanceof Error) {
                Swal.fire({
                    titleText: 'エラー',
                    text: result.message,
                    icon: 'error',
                });
                return;
            }
            Swal.fire({
                titleText: '確認しました',
                icon: 'success',
            });
        };
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>車ID</th>
                    <th>状態</th>
                    <th>どこ</th>
                    <th>電池</th>
                    <th>生存時刻</th>
                    <th>異常検知ボタン</th>
                </tr>
            </thead>
            <tbody>
                {
                    carstatus.map((elem) => {
                        const emerg = elem.status === 5 || elem.status === 6;
                        return(
                            <tr>
                                <td>{elem.carId}</td>
                                <td>{emerg ? '異常' : '正常'}</td>
                                <td>{elem.location.lat}, {elem.location.lng}</td>
                                <td>{elem.battery}</td>
                                <td>{elem.lastAt.toString()}</td>
                                <td>
                                    <button disabled={!emerg} onClick={generateConfirmer(elem.carId)}>確認</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default CarTable;
