<template lang="pug">

section.editor
  p.control
    textarea.textarea( v-model="note.content", @input="editNote(note)", @focus="focus", ref="editor")

</template>

<script>

import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as types from '../../store/mutation-types';

// TODO: create query media Vue plugin
function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

export default {

  computed: mapState({
    note: state => state.notes.activeNote
  }),

  methods: {
    editNote (note) { this.$store.dispatch('editNote', note); },
    focus () { if (isMobile()) this.$store.dispatch('toggleList', false); }
  },

  created () {
    this.unsubscribe = this.$store.subscribe( ({ type }) => {
      if (type === types.FOCUS_EDITOR) {
        Vue.nextTick( () => {
          let editor = this.$refs.editor;
          editor.selectionStart = 0;
          editor.selectionEnd = 0;
          editor.focus();
        });
      }
    });
  },

  beforeDestroy () {
    this.unsubscribe();
  }

};

</script>

<style lang="stylus" scoped>

.editor
  height: 100%

  .control
    height: 100%

    .textarea
      height: 500px;
      box-shadow: none
      border-width: 0 0 0 1px
      border-radius: 0

.card
  .card-content
    padding-bottom: 4.5rem

</style>
