import S from 's-js';
import { AppCtrl } from './controllers';

// with such a simple router scenario, no need for a lib, just hand-write it
export function AppRouter(ctrl : AppCtrl) {
    // browser hash -> filter()
    window.addEventListener('hashchange', setStateFromHash, false);
    S.cleanup(function () { window.removeEventListener('hashchange', setStateFromHash); });
    function setStateFromHash() {
        var hash   = window.location.hash,
            filter = hash === "#/completed" ? true  :
                     hash === "#/active"    ? false :
                     null;

    }

    // init from browser hash
    setStateFromHash();

    // filter() -> browser hash
    S(() => {
    });
}
