---
title: Product title
layout: base_layout
---
PRODUCTS BELOW:
{% for item in collections.product %}
- [{{ item.data.name }}]({{ item.url }}) for ${{ item.data.price }}
{% endfor %}