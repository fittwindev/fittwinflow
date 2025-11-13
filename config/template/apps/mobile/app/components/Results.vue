<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-4">
      <Label class="h2" text="Results" />
      <Label text="(See web app for full copy; this is a stub mirroring canonical flow.)" textWrap="true"/>
      <Button text="Next" @tap="go"/>
    </StackLayout>
  </Page>
</template>
<script>
export default {
  methods:{
    go(){
      const next = {
        Welcome: 'HowItWorks',
        HowItWorks: 'Permissions',
        Permissions: 'Setup',
        Setup: 'FrontCapture',
        FrontCapture: 'RotateSide',
        RotateSide: 'Processing',
        Processing: 'Results',
        Results: 'Results'
      }[this.$options.name];
      this.$navigateTo(require('./'+next+'.vue').default);
    }
  },
  name: "Results"
}
</script>
