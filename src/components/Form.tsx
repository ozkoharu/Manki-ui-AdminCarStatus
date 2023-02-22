import React from 'react';
import * as Manki from 'api/manki';
import * as App from 'App';

function Form() {
    const adminId = React.useContext(App.adminDataContext).adminId as Manki.AdminId;

    async function terminate() {
        const result = await Manki.terminate(adminId);
        if (result instanceof Error) {
            return;
        }
        window.location.reload();
    }
    return(
        <form id="form" className="the-form" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
                <legend>やっぱりやめる</legend>
                <button onClick={() => terminate()}>戻る</button>
            </fieldset>
        </form>
    )
}

export default Form;
