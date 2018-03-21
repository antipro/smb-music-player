<template>
  <div class="control">
    <span class="btn btn-previous" role="button">
      <i class="material-icons">&#xE045;</i>
    </span>
    <span class="btn btn-play">
      <i class="material-icons">&#xE037;</i>
    </span>
    <span class="btn btn-next">
      <i class="material-icons">&#xE044;</i>
    </span>
    <div class="progress-bar">
      <div class="progress" style="width: 0%;"></div>
    </div>
  </div>
</template>

<style>
.control {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ff6659;
}
.control .btn {
  display: inline-block;
  background: #338a3e;
  border-radius: 50%;
  color: #383636;
  margin: 4px 3px;
}
.control .btn:active {
  background-color: #a9b4b6;
  transform: scale(1.2, 1.2);
}
.control .btn .material-icons {
  color: #000;
}
.control .btn-play {
  width: 48px;
  height: 48px;
}
.control .btn-play .material-icons {
  font-size: 36px;
  margin: 6px;
}
.control .btn-previous, .btn-next {
  width: 36px;
  height: 36px;
}
.control .btn-previous .material-icons, .btn-next .material-icons {
  font-size: 24px;
  margin: 6px;
}
.control .progress-bar {
  flex-grow: 1;
  margin: 3px;
  background-color: #FFF;
  height: 5px;
  border-radius: 2px;
}
.control .progress-bar .progress {
  background-color: #772b96;
  border-radius: 2px;
  height: 100%;
}
</style>

<script>
export default {
  name: 'control',
  data () {
    return {}
  }
}
</script>
