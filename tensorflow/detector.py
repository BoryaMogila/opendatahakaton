# TensorFlow and tf.keras
import tensorflow as tf
from tensorflow import keras

# Helper libraries
import numpy as np
import matplotlib.pyplot as plt
import os
import json

class detector():
    CLASS_NAMES = ['OK', 'NOTOK']
    INPUT_SHAPE = (17, 2)
    LOSS = 'sparse_categorical_crossentropy'
    MODEL = None
    METRICS = ['accuracy']
    TRAIN_COEF = 0.1

    def __init__(self, class_names, input_shape):
        self.INPUT_SHAPE = input_shape
        self.CLASS_NAMES = class_names
        label_layers = len(claself.CLASS_NAMESss_name)
        self.MODEL = keras.Sequential([
            keras.layers.Flatten(input_shape=input_shape),
            keras.layers.Dense(128, activation=tf.nn.relu),
            keras.layers.Dense(label_layers, activation=tf.nn.softmax)
        ])
        self.MODEL.compile(optimizer=tf.train.AdamOptimizer(), 
              loss=self.LOSS,
              metrics=self.METRICS)

    def train_from_file(path, epohs=5):
        data = {"input": [], output:[]}
        with open(path, "r") as json_data:
            data = json.load(json_data)
        self.train(data["input"], data["output"])

    def train(input, output, epohs=5):
        rand = numpy.random.choice(input, size=int(input*self.TRAIN_COEF), replace=False)
        i = 0
        train_input = []
        train_labels = []
        test_input = []
        test_labels = []
        for item in input:
            if item in rand:
                train_labels.append(item)
                train_labels.append(otput[i])
            else:
                test_input.append(item)
                test_labels.append(otput[i])
        i += 1
            
        
        self.MODEL.model.fit(np.array(train_input), np.array(train_labels), epochs=epohs)
        test_loss, test_acc = self.MODEL.evaluate(np.array(test_images), np.array(test_labels))
        print('Test accuracy:', test_acc)

    def detect(input):
        predictions = self.MODEL.predict([input])
        return np.argmax(predictions[0])

