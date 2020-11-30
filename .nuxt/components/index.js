export { default as Cast } from '../..\\components\\Cast.vue'
export { default as Detail } from '../..\\components\\Detail.vue'
export { default as Detailtv } from '../..\\components\\Detailtv.vue'
export { default as Footer } from '../..\\components\\Footer.vue'
export { default as Header } from '../..\\components\\Header.vue'

export const LazyCast = import('../..\\components\\Cast.vue' /* webpackChunkName: "components_Cast'}" */).then(c => c.default || c)
export const LazyDetail = import('../..\\components\\Detail.vue' /* webpackChunkName: "components_Detail'}" */).then(c => c.default || c)
export const LazyDetailtv = import('../..\\components\\Detailtv.vue' /* webpackChunkName: "components_Detailtv'}" */).then(c => c.default || c)
export const LazyFooter = import('../..\\components\\Footer.vue' /* webpackChunkName: "components_Footer'}" */).then(c => c.default || c)
export const LazyHeader = import('../..\\components\\Header.vue' /* webpackChunkName: "components_Header'}" */).then(c => c.default || c)
