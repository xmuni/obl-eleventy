from jinja2 import Template, Environment, FileSystemLoader

def render_template(path_template, output=None, **kw):
    env = Environment(loader=FileSystemLoader('./'))
    template = env.get_template(path_template)
    rendered_html = template.render(**kw)

    if output is not None:
        with open(output, 'w+', encoding='UTF-8') as file:
            file.write(rendered_html)

    return rendered_html
