import React from 'react';
import Form from 'components/Form';
import CarTable from 'components/CarTable';
import Swal from 'sweetalert2';
import * as Manki from 'api/manki';
import './App.css';

export const adminDataContext = React.createContext({} as {
  adminId: Manki.AdminId | undefined,
  carstatus: Manki.CarInfo[],
});

function App() {
  const [adminId, setAdminId] = React.useState<Manki.AdminId>();
  const [carstatus, setCarStatus] = React.useState<Manki.CarInfo[]>([]);

  async function makeAdmin() {
    const { adminName, adminPass } = await (async () => {
      let adminNameResult, adminPassResult;
      do {
        adminNameResult = await Swal.fire({
          titleText: '管理者名を入力してください',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off',
            required: 'on',
          },
          validationMessage: '省略できません',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: false,
        });
        adminPassResult = await Swal.fire({
          titleText: 'パスワードを入力してください',
          input: 'password',
          inputAttributes: {
            autocapitalize: 'off',
            required: 'on',
          },
          validationMessage: '省略できません',
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonText: '戻る',
        });
      } while (!adminPassResult.isConfirmed);
      return {
        adminName: adminNameResult.value,
        adminPass: adminPassResult.value,
      };
    })();
    const adminId = await Manki.loginAdmin(adminName, adminPass);
    if (adminId instanceof Error) {
      Swal.disableButtons();
      Swal.fire({
        titleText: 'ログインに失敗しました',
        text: adminId.message + '続行するにはリロードしてください',
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        willClose: () => window.location.reload(),
      });
      return null;
    }
    setAdminId(adminId);
    return adminId;
  }

  async function getCarStatus(adminId: Manki.AdminId) {
    const result = await Manki.carInfo(adminId);
    if (result instanceof Error) {
        Swal.fire({
            titleText: 'エラー',
            text: result.message,
            icon: 'error',
        });
        return false;
    }
    setCarStatus(result);
}

  const didLogRef = React.useRef(false);
  React.useEffect(() => {
    if (!didLogRef.current) {
      didLogRef.current = true;
      makeAdmin().then((result) => {
        if (result === null) {
          return null;
        }
        getCarStatus(result);
      })
    }
  }, []);

  return (
    <adminDataContext.Provider value={{adminId, carstatus}}>
      <div className="App">
        <Form />
        <CarTable />
      </div>
    </adminDataContext.Provider>
  );
}

export default App;
