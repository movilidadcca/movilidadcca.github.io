# -*- coding: utf-8 -*- 

from pathlib import Path
import os
import shutil

class University():
    def __init__(self, name):
        self.university_name = name
        self.link = ''


class Country():
    def __init__(self, name):
        self.country_name = name
        self.code = ''
        self.isLarge = False
        self.universities = dict()

    def add_university(self, university):
        if university.university_name not in self.universities:
            self.universities[university.university_name] = university

class WebPage():

    def __init__(self, path):
        self.path = path
        self.new_path = 'web_page'
        self.countries = dict()
        self.PHOTOS_BKG = '.img(number)_b{background-image: url("(link)");}'
        self.UNIVERSITY_IMAGES = '<div class="image(number) backg img(number)_b"></div>'
        self.RECOMENDATION = 'recomendaciones.txt'
        self.POSTER = 'poster.txt'
        self.VIDEO = 'video.txt'
        self.PHOTOS = 'fotos.txt'
        self.EXPERIENCE = 'resena.txt'
        self.ICONS = (
            '../recomendation.png',
            '../recomendation.png',
            '../recomendation.png',
            '../testimonio.png',
            '../poster.png'
        )

    def create_university(self, name, country_name):
        dir_path = self.new_path + '/paginas'
        f = open('paginas/plantilla_institucion.html', 'r')
        file = f.read()
        f.close()
        file = file.replace('{{ UNIVERSITY_NAME }}', name)

        # get the interesting links
        p = self.path + '/' + country_name + '/' + name
        i = 0

        with open(p + '/' + self.RECOMENDATION) as endf:
            for line in endf:
                file = file.replace('{{ LINK }}', line[0:len(line)-1], 1)
                file = file.replace('{{ ICON }}', self.ICONS[i], 1)
                i += 1
        with open(p + '/' + self.EXPERIENCE) as endf:
            for line in endf:
                file = file.replace('{{ LINK_EXP }}', line[0:len(line)-1], 1)
                file = file.replace('{{ ICON_EXP }}', self.ICONS[i], 1)
                i += 1
                break
        with open(p + '/' + self.POSTER) as endf:
            for line in endf:
                file = file.replace('{{ LINK_POS }}', line[0:len(line)-1], 1)
                file = file.replace('{{ ICON_POS }}', self.ICONS[i], 1)
                i += 1
                break

        css_images = ''
        html_images = ''

        i = 1
        with open(p + '/' + self.PHOTOS) as endf:
            for line in endf:
                temp = self.PHOTOS_BKG.replace('(number)', str(i))
                temp = temp.replace('(link)', line[0:len(line)-1])
                css_images += temp
                temp = self.UNIVERSITY_IMAGES.replace('(number)', str(i))
                html_images += temp
                i += 1
            file = file.replace('{{ PHOTOS_BKG }}', css_images)
            file = file.replace('{{ UNIVERSITY_IMAGES }}', html_images)

        with open(p + '/' + self.VIDEO) as endf:
            for line in endf:
                file = file.replace('{{ VIDEO }}', line[0:len(line)-1], 1)
                break

        # here we need to improve the name system
        new_file = open(dir_path + '/' + name.replace(' ', '_') + '.html', 'w')
        new_file.write(file)
        new_file.close()


    def create_directories(self):
        try:
            #create all needed directories
            os.makedirs(self.new_path + '/paginas')
        except FileExistsError:
            shutil.rmtree(self.new_path)
            self.create_directories()

    def create_web_page(self):
        p = Path(self.path)

        #create the directories
        self.create_directories()

        # get the country
        for country in p.iterdir():
            # check if it is a directory
            if country.is_dir():
                # removing the absolute path
                c = (str(country).replace(self.path, ''))[1:]
                # adding the country to the countries dictionary
                if c not in self.countries:
                    self.countries[c] = Country(c)
                # open the universities in the country's directory
                p_university = Path(self.path + '/' + c)
                # iterate over the country's directory
                for university in p_university.iterdir():
                    # check if the university is a directory
                    if university.is_dir():
                        # removing the absolute path
                        u = (str(university).replace(self.path + '/' + c, ''))[1:]
                        self.create_university(u,c)




wp = WebPage('/Users/ianMJ/Documents/ESCOM/servicio_social/ianmendozajaimes.github.io/creador_prueba')
wp.create_web_page()
