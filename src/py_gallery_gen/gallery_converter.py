from PIL import Image
import os
import shutil
import hashlib
from jinja_renderer import render_template


THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))


# PATH_INPUT  = './source/img'
PATH_INPUT  = 'D:/Dropbox/img 6x4 foto fullhd'
PATH_OUTPUT_IMG = '../img/'
PATH_OUTPUT_RENDER = '../'

RESIZE = True
OVERWRITE = False
DELETE_OLD = True

SIZES = [
    ['_h', 2000],
    ['_m', 900],
    ['_s', 300],
]


category_labels = {
    'paesaggi':     'Paesaggi',
    'macro':        'Macro',
    'foglie':       'Foglie',
    'fioriefrutti': 'Fiori e frutti',
    'funghi':       'Funghi',
    'eco':          'Ecosistemi',
    # 'quadri':       'Quadri e Composizioni',
}

CAPTIONS = {
    'vm': '© Vittorio Minuzzo',
    'DEFAULT': '© mmoblfoto.it',
}


def hashstr(text,length=32):
    return hashlib.md5(text.encode('utf-8')).hexdigest()[:length]

def hashbytes(bytearr,length=32):
    return hashlib.md5(bytearr).hexdigest()

def hashfile(path,length=32):
    hashed = ''
    with open(path, 'rb') as file:
        hashed = hashlib.md5(file.read()).hexdigest()
    return hashed


def resize(input_path,output_path,maxsize):
    # if not os.path.exists():
        # os.mkdir(output_folder)

    # print(input_path,output_path,maxsize)

    img = Image.open(input_path)

    w = img.width
    h = img.height

    # print(input_path,maxsize,w,h)

    # If already smaller than target, copy without resizing
    if w < maxsize and h < maxsize or maxsize is None:
        img.save(output_path, 'JPEG', quality=80)
        # print('Copying without resizing')

    elif w > h:
        new_w = maxsize
        new_h = round(h/w*maxsize)
        new_img = img.resize((new_w,new_h), Image.ANTIALIAS)
        new_img.save(output_path, 'JPEG', quality=80)
        # print('Resizing to',new_w,'x',new_h)

    else:
        new_h = maxsize
        new_w = round(w/h*maxsize)
        new_img = img.resize((new_w,new_h), Image.ANTIALIAS)
        new_img.save(output_path, 'JPEG', quality=80)
        # print('Resizing to',new_w,new_h)

    print('Image saved:',output_path)





def get_caption(img_path):

    # print('Getting caption:',img_path)

    if '[' in img_path:
        # print('\n\n')
        # print(img_path)
        text = img_path.split('[')[1]
        if ']' in text:
            text = text.split(']')[0]
            if text in CAPTIONS:
                # print('\n',img_path)
                # print('Caption found:',text, '-->', CAPTIONS[text])
                return CAPTIONS[text]
            else:
                # print('\n',img_path)
                # print('Caption found:',text)
                return text

    return CAPTIONS['DEFAULT']
    


def main():
    print(os.listdir(THIS_FOLDER))

    paths = []
    
    for foldername in os.listdir(PATH_INPUT):
        if not foldername.startswith('_') and not '.' in foldername:
            for filename in os.listdir(os.path.join(PATH_INPUT,foldername)):
                if not filename.startswith('_'):
                    # print(foldername,filename)
                    paths.append([foldername,filename.lower()])

    for p in paths:
        print(p)


    images_data = []

    resized = set()

    for foldername,filename in paths:
        output_folder = os.path.join(PATH_OUTPUT_IMG,foldername)
        # convert_image(filepath,output_folder)
        if not os.path.exists(output_folder):
            os.mkdir(output_folder)

        input_path = os.path.join(PATH_INPUT,foldername,filename)

        _,ext = os.path.splitext(filename)
        # hashed_basename = hashstr(filename,16)
        hashed_basename = hashfile(input_path,16)

        new_img = {
            # 'input_path': os.path.join(foldername,filename),
            'filename': filename.lower(),
            'hashed_path': hashed_basename+ext,
        }
        images_data.append([foldername,new_img])

        # Resize if necessary
        for suffix,maxsize in SIZES:
            output_filename = hashed_basename+suffix+ext
            output_path = os.path.join(output_folder,output_filename).lower()
            resized.add(os.path.join(foldername,output_filename))
            if RESIZE and (OVERWRITE or not os.path.exists(output_path)):
                resize(input_path,output_path,maxsize)

    if DELETE_OLD:
        print('Resized:',len(resized),resized)

        imgs_to_delete = []
        for foldername in ['eco','fioriefrutti','foglie','macro','paesaggi','funghi']:
            folder = os.path.join(PATH_OUTPUT_IMG,foldername)
            print(folder)
            for filename in os.listdir(folder):
                path = os.path.join(foldername,filename)
                print(path,path in resized)
                if not path in resized:
                    imgs_to_delete.append(path)

        print('\nDeleted {} images:'.format(len(imgs_to_delete)))
        for img in imgs_to_delete:
            path = os.path.join(PATH_OUTPUT_IMG,img)
            os.remove(path)
            print(path,'deleted')
                



    categories = {}
    for category_codename,img_dic in images_data:
        if not category_codename in categories:
            categories[category_codename] = {
                'codename': category_codename,
                'label': category_labels[category_codename],
                'images': [],
            }

        filename = img_dic['filename']
        img_path = img_dic['hashed_path']
        new_img = {
            'path': img_path.replace('.jpg',''),
            'caption': get_caption(filename),
        }
        categories[category_codename]['images'].append(new_img)




    # Render gallery with jinja
    category_names = ['paesaggi','macro','foglie','fioriefrutti','funghi','eco']
    render_template('./template_gallery_eleventy.html', output=os.path.join(PATH_OUTPUT_RENDER,'gallery.njk'), title='Fotografie', categories=categories, category_names=category_names)




if __name__ == "__main__":
    # test()
    main()