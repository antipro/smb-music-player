<template>
  <div class="about">
    <h3>Author</h3>
    <p>antiproster</p>
    <h3>Email</h3>
    <p>antiproster@gmail.com</p>
    <h3>Instruction</h3>
    <p>This is a simple music player, It is used to listen music from nas/computer in your home/office.
      It will index all of your music files, so they can be searched instantly.
      Only file name can be indexed for now, but I will try to index tag info later.
      If you have any question, please let me know.
      According to Google's policy, you can refund in 24 hours after purchase.</p>
    <p>Regards</p>
  </div>
</template>

<style>
.about { padding: 15px; }
</style>

<script>
export default {
  name: 'about',
  data () {
    return {}
  },
  created () {
    this.$parent.title = 'About'
  }
}
</script>
