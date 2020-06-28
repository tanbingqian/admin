const orderState = [
    {
        label: "未支付",
        value: "NEW"
    },
    {
        label: "已支付",
        value: "PAID"
    },
    {
        label: "生产中",
        value: "PRODUCING"
    },
    {
        label: "生产完成",
        value: "PRODUCED"
    },
    {
        label: "已发货",
        value: "ALLSHIPPED"
    },
    {
        label: "部分发货",
        value: "PARTSHIPPED"
    },
    {
        label: "已收货",
        value: "RECEIVED"
    },
    {
        label: "已取消",
        value: "CANCELED"
    },
    {
        label: "已删除",
        value: "DELETED"
    }
]

// 设备状态
const deviceState = [
    {
        label: "启用",
        value: 1
    },
    {
        label: "禁用",
        value: -1
    }
]

// 是否在线
const onlineState = [
    {
        label: '在线',
        value: 1
    },
    {
        label: '离线',
        value: 0
    }
]

// 魔方单元格样式
const cellClass = [
    'cube-cell-one',
    'cube-cell-two',
    'cube-cell-three',
    'cube-cell-four',
    'cube-cell-five',
    'cube-cell-six',
    'cube-cell-seven',
    'cube-cell-eight'
]
export { orderState, deviceState, onlineState, cellClass }
