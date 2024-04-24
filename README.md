# Digitalcheck Monorepo

This repository contains web applications in the Digitalcheck context.

## Prerequisites

### Git Hooks

For the provided Git hooks you will need to install [lefthook](https://github.com/evilmartians/lefthook/blob/master/docs/full_guide.md)
(git hook manager):

```bash
brew install lefthook
./run.sh init
```

The following hooks are specified in the `lefthook.yml`:

- `commitlint` - write [conventional commit messages](https://chris.beams.io/posts/git-commit/)
- `lint` - avoid committing code violating linting rules
- `format` - avoid committing wrongly formatted code

Before pushing, the following checks are additionally ran:

- `licenses-audit` - uses `license-checker` to verify dependency licenses

## Contributing

🇬🇧
Everyone is welcome to contribute the development of the Digitalcheck applications. You can contribute by opening pull request,
providing documentation or answering questions or giving feedback. Please always follow the guidelines and our
[Code of Conduct](CODE_OF_CONDUCT.md).

🇩🇪
Jede:r ist herzlich eingeladen, die Entwicklung der Digitalcheck Applikationen mitzugestalten. Du kannst einen Beitrag leisten,
indem du Pull-Requests eröffnest, die Dokumentation erweiterst, Fragen beantwortest oder Feedback gibst.
Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT_DE.md).

## Contributing code

🇬🇧
Open a pull request with your changes and it will be reviewed by someone from the team. When you submit a pull request,
you declare that you have the right to license your contribution to the DigitalService and the community.
By submitting the patch, you agree that your contributions are licensed under the MIT license.

Please make sure that your changes have been tested befor submitting a pull request.

🇩🇪
Nach dem Erstellen eines Pull Requests wird dieser von einer Person aus dem Team überprüft. Wenn du einen Pull-Request
einreichst, erklärst du dich damit einverstanden, deinen Beitrag an den DigitalService und die Community zu
lizenzieren. Durch das Einreichen des Patches erklärst du dich damit einverstanden, dass deine Beiträge unter der
MIT-Lizenz lizenziert sind.

Bitte stelle sicher, dass deine Änderungen getestet wurden, bevor du einen Pull-Request sendest.
