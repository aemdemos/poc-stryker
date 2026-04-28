# Your Project's Title...
 Stryker - Team POC

## Environments
- Preview: https://ina--poc-stryker--aemdemos.aem.page

## Sample page : 
https://www.stryker.com/us/en/about/news/2022/features/advancing-healthcare-through-asian-culture-and-collaboration.html
https://ina--poc-stryker--aemdemos.aem.page/us/en/about/news/2022/features/advancing-healthcare-through-asian-culture-and-collaboration

Template: 2D (Feature Article — Carousel/Grid) → 20/508  ( tools/importer/all-editorial-urls.txt )

## Imported pages:
https://www.stryker.com/us/en/about/news/2022/features/celebrating-hispanic-heritage---driving-our-mission-forward.html
https://ina--poc-stryker--aemdemos.aem.page/us/en/about/news/2022/features/celebrating-hispanic-heritage-driving-our-mission-forward

https://www.stryker.com/us/en/about/news/2022/features/military-members-on-a-mission-to-make-healthcare-better.html
https://www.stryker.com/us/en/about/news/2022/features/more-than-able-to-make-healthcare-better.html
https://www.stryker.com/us/en/about/news/2022/features/paving-the-way-forward-for-black-professionals.html
https://www.stryker.com/us/en/about/news/2022/features/sparking-curiosity-at-stryker-s-second-annual-de-i-summit.html
https://www.stryker.com/us/en/about/news/2022/features/three-ways-stryker-works-to-support-physicians-in-their-pursuit-.html
https://www.stryker.com/us/en/about/news/2022/features/tour-the-amsterdam-skills-centre--an-international-training-cent.html
https://www.stryker.com/us/en/about/news/2022/reimagining-nursing-for-the-future.html
https://www.stryker.com/us/en/about/news/2023/features/five-things-to-know-about-heart-attacks-and-sudden-cardiac-arrests.html
https://www.stryker.com/us/en/about/news/2023/features/new-spy-phi-technology--to-help-breast-cancer-surgeons-see-more-.html
https://www.stryker.com/us/en/about/news/2023/features/paving-the-way-forward-for-black-professionals.html
https://www.stryker.com/us/en/about/news/2023/features/three-ways-stryker-works-to-support-physicians-in-their-pursuit-.html
https://www.stryker.com/us/en/about/news/2023/features/transforming-confidence-and-care-in-partnership-with-operation-smile.html
https://www.stryker.com/us/en/about/news/2024/features/a-partnership-promoting-mental-health-for-healthcare-workers.html
https://www.stryker.com/us/en/about/news/features/driven-to-give--three-ways-stryker-employees-are-giving-back.html
https://www.stryker.com/us/en/about/news/features/going-the-distance-for-front-line-heroes.html
https://www.stryker.com/us/en/about/news/features/packaging-for-a-better-planet.html
https://www.stryker.com/us/en/about/news/features/s-it-a-heart-attack-or-sudden-cardiac-arrest--know-the-warning-s.html
https://www.stryker.com/us/en/about/news/features/stryker-donates-22-500-emergency-relief-bed-kits-to-project-c-u-.html
https://www.stryker.com/us/en/about/news/features/technologies-that-promote-safe-care-for-mother-and-baby-during-c.html



## Documentation

Before using the aem-block-collection, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/ue-tutorial)
1. [Creating Blocks](https://www.aem.live/developer/universal-editor-blocks) and [Content Modelling](https://www.aem.live/developer/component-model-definitions)
1. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
1. [Web Performance](https://www.aem.live/developer/keeping-it-100)
1. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)
1. [AEM Block Collection](https://www.aem.live/developer/block-collection#block-collection-1)


## Installation

```sh
npm i
```

Linting and security
This project is using StyleLint and ESLint for Javascript. Our ESLint configuration includes 3 popular and reputable Javascript code quality and security plugins:

- SonarSource eslint-plugin-sonarjs, a code quality analyzer for JavaScript and TypeScript within the Sonar ecosystem (https://github.com/SonarSource/SonarJS/blob/master/packages/jsts/src/rules/README.md#eslint-rules)
- Interlace secure-coding plugin for general secure coding practices and OWASP compliance for JavaScript/TypeScript (https://eslint.interlace.tools/docs/security/plugin-secure-coding/rules)
- Interlace browser-security for XSS, cookie, and DOM security rules for client-side JavaScript (https://eslint.interlace.tools/docs/security/plugin-browser-security/rules).

They are included in this command, which is run automatically via a github action on every pull request:

```sh
npm run lint
```


## Local development

1. Create a new repository based on the `aem-block-collection` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `ise-boilerplate` directory in your favorite IDE and start coding :)
