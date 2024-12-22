<template>
  <div class="menu">
    <RouterLink to="/" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-bullseye"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/leaderboard" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-trophy"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/spin" custom v-slot="{ isActive, navigate }">
  <i class="menu-button fa fa-gamepad" :class="{ active: isActive }" @click="navigate" aria-hidden="true"></i>
</RouterLink>


    <RouterLink to="/tasks" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-tasks"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    <RouterLink to="/shop" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-shop"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

   

    <RouterLink to="/friends" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-users"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      ></i>
    </RouterLink>

    

    <!-- Добавляем новую ссылку на страницу магазина -->
    
  </div>
</template>
