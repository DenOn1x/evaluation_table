import {createStore} from 'vuex';

const store = createStore({
    state: {
        totalTime: 0,
        totalPrice: 0,
    },
    mutations: {
        updateTotalTime(state, time) {
            state.totalTime = time;
        },
        updateTotalPrice(state, price) {
            state.totalPrice = price;
        }
    }
});


export default store