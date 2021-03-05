---
title: Home page title
layout: base_layout
rerender: true
mainclass: home
bodyid: home
bodyclass: bg-eagle
navselect: home
---
{% for item in collections.home-content %}
<section id="" class="">

<div class="display-row">
<div class="display-column">{{ item.data.text}}</div>
<div class="display-column"><img src="{{ item.data.image }}"/></div>
</div>

</section>
{% endfor %}