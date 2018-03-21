<template>
  <div class="search">
    <ul class="material-list">
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #1</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #2</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #3</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #4</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
      <li>
        <div class="tumbal">
          <i class="material-icons">&#xE2C7;</i>
        </div>
        <div class="text">Folder #5</div>
      </li>
    </ul>
  </div>
</template>

<style>
.search {
  overflow-y: auto;
}

.material-list {
  margin: 5px 15px;
  padding: 0;
}
.material-list * {
  font-size: 24px;
  user-select: none;
}
.material-list > li {
  display: flex;
  align-items: center;
  background-color: #FFF;
  color: #000;
  cursor: pointer;
  padding: 6px 12px;
}
.material-list > li:hover {
  background-color: #66bb6a;
}
.material-list .tumbal {
  display: flex;
  margin-right: 6px;
  color: #338a3e;
}
.material-list .text {
  flex-grow: 1;
}
</style>

<script>
export default {
  name: 'search',
  data () {
    return {}
  }
}
</script>
