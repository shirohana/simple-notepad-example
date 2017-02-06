<template lang="pug">

section.section: .container
  h3.title
    | Simple notepad example
  h5.subtitle
    | For Zhou ก(ｰ̀ωｰ́ก)
  hr

  .box: .columns.is-mobile.is-gapless
    .column.is-narrow
      toolbar
    .column.columns.is-mobile.is-gapless
      transition( name="notes-list")
        .notes-list.column.is-3-tablet.is-10-mobile( v-show="showNoteList")
          notes-list
      .editor.column
        editor

</template>

<script>

import * as types from '../store/mutation-types';
import Toolbar from './static-notes/Toolbar';
import NotesList from './static-notes/NotesList';
import Editor from './static-notes/Editor';

export default {

  data () {
    return {
      showNoteList: true
    };
  },

  watch: {
    '$mq.resize' () {
      this.update();
    }
  },

  components: { Toolbar, NotesList, Editor },

  created () {
    this.update = () => {
      this.showNoteList = this.$mq.isTablet() ? true : this.$store.state.notes.showNoteList;
    }

    this.update();
    this.$store.dispatch('fetchNotes');

    this.unsubscribe = this.$store.subscribe( ({ type, payload: isShow }) => {
      if (type === types.TOGGLE_NOTE_LIST) {
        this.update();
      }
    });
  },

  beforeDestroy () {
    this.unsubscribe();
  }

};

</script>

<style lang="stylus" scoped>

.box
  margin-top: 2.25rem
  padding: 0

  .column
    padding-top: 0
    padding-bottom: 0
    overflow: hidden

  .editor
    min-width: 75%

.notes-list
  transition: width .3s
  &-enter
  &-leave-active
    width: 0%

</style>
