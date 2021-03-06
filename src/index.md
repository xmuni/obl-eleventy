---
title: Orto Botanico Locatelli
layout: base_layout
rerender: true
pagename: home
navselect: home
---
{% for item in collections.home-content %}
<section id="" class="">

<div class="display-row">
<div class="display-column">{{ item.templateContent }}</div>
<div class="display-column"><img src="{{ item.data.image }}"/></div>
</div>

</section>
{% endfor %}