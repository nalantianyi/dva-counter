import dva, {connect} from 'dva';
import {Router, Route} from 'dva/router';
import fetch from 'dva/fetch';
import key from 'keymaster';
import styles from './index.less';
import React from 'react';
import './index.html';

const app = dva();
function delay(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
app.model({
    namespace: 'count',
    state: {
        record: 0,
        current: 0
    },
    effects: {
        *add(action, {call, put}){
            yield call(delay, 1000);
            yield put({type: 'minus'});

        }
    },
    reducers: {
        add(state){
            const newCurrent = state.current + 1;
            return {...state, record: newCurrent > state.record ? newCurrent : state.record, current: newCurrent};
        },
        minus(state){
            return {...state, current: state.current - 1};
        }
    },
    subscriptions: {
        keyboardWatcher({dispatch}){
            key('⌘+up, ctrl+up', () => {
                dispatch({type: 'add'})
            });
        }
    }
});

const CountApp = ({count, dispatch}) => {
    return (
        <div className={styles.normal}>
            <div className={styles.record}>Highest Record:{count.record}</div>
            <div className={styles.current}>{count.current}</div>
            <div className={styles.button}>
                <button onClick={() => {
                    dispatch({type: 'count/add'});
                }}>+
                </button>
            </div>
        </div>
    );
};

//连接 model 和 Component
function mapStateToProps(state) {
    return {count: state.count};
}
const HomePage = connect(mapStateToProps)(CountApp);
app.router(({history}) =>
    <Router history={history}>
        <Route path="/" component={HomePage}/>
    </Router>
);

// 4. Start
app.start('#root');
