<template>
        <article class="form-box">
            <section class="form-top">
                <h2 class="form-headline"> Registrace </h2>
                <p class="form-subtitle"> Vyplňte následující údaje a vytvořte si účet </p>
            </section>
            <form>
                <div class="form-input">
                    <label> Uživatelské jméno </label>
                    <input type="text" id="username" placeholder="Zadejte své uživatelské jméno">
                </div>
                <div class="form-input">
                    <label class="form-label"> E-mail </label>
                    <input type="email" id="email" placeholder="Zadejte svůj email">
                </div>

                <div class="form-input">
                    <label class="form-label"> Heslo </label>
                    <input type="password" id="password" placeholder="Zadejte své heslo">
                </div>

                <div class="form-input">
                    <label> Potvrzení hesla </label>
                    <input type="password" id="password-confirm" placeholder="Potvrďte své heslo">
                </div>

                <div>
                    <label>
                        <input type="checkbox">
                        <span> Souhlasím s podmínkami používání a ochranou osobních údajů.  </span>
                    </label>
                </div>

                <button type="submit" class="submit-btn"> Registrovat se </button>
            </form>
        </article>
</template>