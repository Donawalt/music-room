<template>
    <div>
        <div class="error-container">
            <div class="error-icon">
                <i class="iconfont icon-error"></i>
            </div>
            <div class="error-text">
                <div class="error-title">Une ereeur est arrivée</div>
                <div class="error-content">Voici les détails de l'erreur</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'error'
    }
</script>
<style>
    .error-page {
        text-align: center;
        margin-top: 60px;
        color: #999;
    }
    .error-page h1 {
        font-size: 70px;
        margin: 0;
    }
    .error-page p {
        font-size: 40px;
        color: #999;
        margin: 0;
    }
</style>    