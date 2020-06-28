<template>
    <div>
        <script :id="editorId" name="content" type="text/plain" style="width:600px; height:200px;">

        </script>
    </div>
</template>

<script>
export default {
    name: 'TextEditor',
    props: ['initHtml'],
    mounted () {
        this.$nextTick(function () {
            this.initEditor()
        })
    },
    data () {
        return {

        }
    },
    computed: {
        editorId () {
            return this.$route.meta.editorPre + '_' + this.lang
        }
    },
    methods: {
        initEditor () {
            let that = this
            this.ueditor = UM.getEditor(this.editorId)
            this.ueditor.addListener('contentchange', function () {
                that.$emit('contentChange', that.ueditor.getContent())
            })
        }
    },
    activated () {
        this.$nextTick(function () {
            this.initEditor()
        })
    },
    deactivated () {
        console.log('component deactiveted..')
        UM.delEditor(this.editorId)
    },
    destroyed () {
        // 销毁editor
        UM.delEditor(this.editorId)
    },
}
</script>

