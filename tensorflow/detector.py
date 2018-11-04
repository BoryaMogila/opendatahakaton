# TensorFlow and tf.keras
import tensorflow as tf
from tensorflow import keras

# Helper libraries
import numpy as np
import matplotlib.pyplot as plt
import os
import json
import h5py

class Detector():
    CLASS_NAMES = ['OK', 'NOTOK']
    INPUT_SHAPE = (17, 2)
    LOSS = 'sparse_categorical_crossentropy'
    MODEL = None
    METRICS = ['accuracy']
    TRAIN_COEF = 0.1

    def __init__(self, class_names, input_shape):
        self.INPUT_SHAPE = input_shape
        self.CLASS_NAMES = class_names
        label_layers = len(self.CLASS_NAMES)
        self.MODEL = keras.Sequential([
            keras.layers.Flatten(input_shape=input_shape),
            keras.layers.Dense(128, activation=tf.nn.relu),
            keras.layers.Dense(label_layers, activation=tf.nn.softmax)
        ])
        self.MODEL.compile(optimizer=tf.train.AdamOptimizer(), 
              loss=self.LOSS,
              metrics=self.METRICS)

    def train_from_file(self,pathfile, epohs=5):
        data = {"input": [], "output":[]}

        with open(pathfile, "r") as json_data:
            data = json.load(json_data)


        self.train(data)

    def train(self,indata, epohs=5):
        rand = np.random.choice(np.arange(0, int(len(indata))), size=int(len(indata)*self.TRAIN_COEF), replace=False)
        i = 0
        train_input = []
        train_labels = []
        test_input = []
        test_labels = []
        for item in indata:
            if i not in rand:
                train_input.append(item['input'])
                train_labels.append(item['output'])
            else:
                test_input.append(item['input'])
                test_labels.append(item['output'])
            i += 1
        self.MODEL.fit(np.array(train_input), train_labels, epochs=epohs)
        test_loss, test_acc = self.MODEL.evaluate(np.array(test_input), np.array(test_labels))
        print('Test accuracy:', test_acc)

    def detect(self, input):
        predictions = self.MODEL.predict([input])
        return np.argmax(predictions[0])

    def save(self):
        model_json = self.MODEL.to_json()
        with open("model.json", "w") as json_file:
            json_file.write(model_json)
        self.MODEL.save_weights("./checkpoints")