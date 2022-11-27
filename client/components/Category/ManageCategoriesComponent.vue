<template>
  <section>
    <ul id="categories-list">
      <li v-for="category in categories" :key="category.id">

        <!-- viewing this category, present a collapsable view -->
        <b-collapse v-if="!editing[category.name]" class="card" animation="slide">
          <template #trigger="props">
            <div class="card-header" role="button">
                <p class="card-header-title">{{category.name}}</p>
                <a class="card-header-icon"><b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon></a>
            </div>
          </template>
          <div class="card-content">
            <div class="content">
              <ul v-if="category.subcategories.length" id="subcategories-list">
                <li v-for="subcategory in category.subcategories" :key="subcategory.id" class="card subcategory">
                  {{ subcategory.name }}
                </li>
              </ul>
            </div>
          </div>
          <footer class="card-footer">
            <!-- <a class="card-footer-item"><b-icon icon="plus" />Add subcategory</a> -->
            <a class="card-footer-item" @click="startEdit(category)"><b-icon icon="pen"/>Edit</a>
            <a class="card-footer-item" @click="deleteCategory(category)"><b-icon icon="delete" />Delete category</a>
          </footer>
        </b-collapse>

        <!-- editing this category, present editable and uncollapsable view -->
        <div v-else class="card" animation="slide">
          <div class="card-header" role="button">
              <b-field 
                :type="{'is-danger': badName[draft[category.name].name]}" 
                :message="{'This name is being used more than once.': badName[draft[category.name].name]}">
                  <b-input class="card-header-title" v-model="draft[category.name].name" />
              </b-field>
          </div>
          <div class="card-content">
            <div class="content">
              <ul v-if="draft[category.name].subcategories.length" id="subcategories-list">
                <li v-for="subcategory in draft[category.name].subcategories" :key="subcategory.id" class="card subcategory">
                  <b-field
                    :type="{'is-danger': badName[subcategory.name]}" 
                    :message="{'This name is being used more than once somewhere.': badName[subcategory.name]}">
                      <b-input class="card-header-title" v-model="subcategory.name" required placeholder="Subcategory name" />
                  </b-field>
                  <a
                    @click="draft[category.name].subcategories = draft[category.name].subcategories.filter(sc => sc != subcategory)">
                    <b-icon icon="delete" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" @click="addSubcategory(category)"><b-icon icon="plus" />Add subcategory</a>
            <a class="card-footer-item" @click="saveChanges(category)"><b-icon icon="content-save" />Save</a>
            <a class="card-footer-item" @click="discardChanges(category)"><b-icon icon="cancel"/>Discard changes</a>
          </footer>
        </div>

      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "ManageCategoriesComponent",
  data() {
    return {
      editing: {},
      draft: {},
      badName: {},
      categories: null,
    }
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      this.categories = [
        {name: 'Category 1', subcategories: [{name: 'Subcategory 1'}, {name: 'Subcategory 2'}]},
        {name: 'Category 2', subcategories: [{name: 'Subcategory 3'}, {name: 'Subcategory 4'}]},
        {name: 'Category 3', subcategories: [{name: 'Subcategory 5'}, {name: 'Subcategory 6'}]},
      ]
    },
    startEdit(category) {
      this.$set(this.editing, category.name, true);
      this.$set(this.draft, category.name, JSON.parse(JSON.stringify(category)));
    },
    deleteCategory(category) {
      this.categories = this.categories.filter(c => c.name !== category.name);
    },
    addSubcategory(category) {
      this.draft[category.name].subcategories.push({name: ''});
    },
    saveChanges(category) {
      let names = new Set();
      let valid = true;
      this.badName = {};

      // first, add names of other, NOT YET SAVED categories
      this.categories.filter(c => c !== category).forEach(c => {
        names.add(c.name);
        c.subcategories.forEach(sc => names.add(sc.name));
      });

      // this is tedious, but we need to check if the name is already used
      if (names.has(this.draft[category.name].name)) {
        this.badName[this.draft[category.name].name] = true;
        valid = false;
      }
      names.add(this.draft[category.name].name);
      // now the same thing for subcategories
      this.draft[category.name].subcategories.forEach(sc => {
        if (names.has(sc.name)) {
          this.$set(this.badName, sc.name, true);
          valid = false;
        }
        names.add(sc.name);
      });
      if (!valid) return;

      this.$set(this.editing, category.name, false);
      this.$set(this.categories, this.categories.indexOf(category), this.draft[category.name]);
      this.$delete(this.draft, category.name);
    },
    discardChanges(category) {
      this.$set(this.editing, category.name, false);
      this.$delete(this.draft, category.name);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/public/variables.scss';

section {
  max-width: 35em;
  margin: auto;
}
li {
  list-style: none;
  margin-left: 0;
}
#categories-list, #subcategories-list {
  margin-left: 0;
}
.card {
  margin-bottom: 1em;
  background-color: $color-5;
}
.subcategory.card {
  padding: 0.5em 1em;
  display: flex;
  width: max-content;
  align-items: center; 

  background-color: $color-4;
}
.card-content {
  padding: 1em;
}
li .field {
  margin-bottom: 0;
}
</style>