<template>
        <article class="form-box">
            <section class="form-top">
                <h2 class="form-headline"> Přihlášení </h2>
                <p class="form-subtitle"> Zadejte své údaje a pokračujte </p>
            </section>
            <form>
                <div class="form-input">
                    <label class="form-label"> E-mail </label>
                    <input type="email" id="email" placeholder="Zadejte svůj email">
                </div>

                <div class="form-input">
                    <label class="form-label"> Heslo </label>
                    <input type="password" id="password" placeholder="Zadejte své heslo">
                </div>

                <div class="form-options">
                    <label class="checkbox"> 
                        <input type="checkbox">
                        Zapamatovat přihlášení
                    </label>

                    <a class="forgot-password"> Zapomenuté heslo? </a>
                </div>

                <button type="submit" class="submit-btn"> Přihlásit se </button>
            </form>

        </article>
</template>