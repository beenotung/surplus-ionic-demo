import S from 's-js';

import { AppModel} from './models';
import { AppCtrl } from './controllers';
import { AppRouter } from './router';
import { LocalStoragePersistence } from './persistence';
import { AppView } from './views';

S.root(() => {
    const model = AppModel([]),
        ctrl = AppCtrl(model),
        router = AppRouter(ctrl),
        storage = LocalStoragePersistence(model),
        view = AppView(ctrl);

    document.body.appendChild(view);
});
