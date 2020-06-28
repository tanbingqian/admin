import Vuex from 'vuex'
import Vue from 'vue'
import shop from './module/shop'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        fileHost: {},
        siteLogo: ''
    },
    mutations: {
        setFileHost (state, obj) {
            state.fileHost = obj
        },
        setSiteLogo (state, logo) {
            state.siteLogo = logo
        }
    },
    modules: {
        shop: shop
    }
})

export default store
