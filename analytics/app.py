import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st
import numpy as np
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

st.set_option('deprecation.showPyplotGlobalUse', False)

st.title("HEAP ANALYSIS")
data = pd.read_csv("StudentsPerformance.csv")
# st.write(df)
st.markdown("""
Heuristic Evaluation and Analysis of learner Performance
""")
st.write('---')
st.sidebar.header('Learner Input')

gender = ['Male', 'Female']
status = ['None', 'Completed']

gender = st.sidebar.selectbox('Gender', list(gender))
prep_stat = st.sidebar.selectbox('Preparation Status', list(status))
math_score_average = st.sidebar.slider('Average math score',50, 100)
reading_score_average = st.sidebar.slider('Average reading score',30, 80)
writing_score_average = st.sidebar.slider('Average writing score',40, 100)




def user_input_features():
    data = {
        'gender' : gender,
        'test preparation course':prep_stat,
        'math score': math_score_average,
        'reading score': reading_score_average,
        'writing score' : writing_score_average
    }
    features = pd.DataFrame(data, index=[0])
    return features

df = user_input_features()
st.write(df)

#predicting math score
X = data[["reading score", "writing score"]].values
y = data[["math score"]].values
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state = 0, test_size = 0.25)
#Linear reg
model = LinearRegression()
model.fit(X_train, y_train)
st.write("Predicted Math HEAP score")
st.write(model.score(X_test, y_test))


#predicting reading score
X = data[["math score", "writing score"]].values
y = data[["reading score"]].values
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state = 0, test_size = 0.25)
#Linear reg
model = LinearRegression()
model.fit(X_train, y_train)
st.write("Predicted Reading HEAP score")
st.write(model.score(X_test, y_test))


#predicting writing score
X = data[["reading score", "math score"]].values
y = data[["writing score"]].values
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state = 0, test_size = 0.25)
#Linear reg
model = LinearRegression()
model.fit(X_train, y_train)
st.write("Predicted Writing HEAP score")
st.write(model.score(X_test, y_test))


plt.rcParams['figure.figsize'] = (5, 5)
color = plt.cm.rainbow(np.linspace(0, 1, 3))
data['race/ethnicity'].value_counts(dropna = False).plot.bar(color = color)
plt.title('Different Groups', fontsize = 7)
plt.xlabel('Groups')
plt.ylabel('count')
st.pyplot()




fig, ax = plt.subplots(figsize=(8,8))
sns.distplot(data['math score'], color = 'blue')
plt.title('Distribution of math scores', fontsize = 10)
plt.xlabel('score')
plt.ylabel('count')
st.pyplot()



fig, ax = plt.subplots(figsize=(8,8))
sns.distplot(data['reading score'], color = 'pink')
plt.title('Distribution of reading scores', fontsize = 10)
plt.xlabel('score')
plt.ylabel('count')
st.pyplot()


fig, ax = plt.subplots(figsize=(8,8))
sns.distplot(data['writing score'], color = 'violet')
plt.title('Distribution of writing scores', fontsize = 10)
plt.xlabel('score')
plt.ylabel('count')
st.pyplot()

# corr = data.corr()
# mask = np.zeros_like(corr)
# mask[np.triu_indices_from(mask)] = True
# with sns.axes_style("white"):
#     f, ax = plt.subplots(figsize=(7, 5))
#     ax = sns.heatmap(corr, mask=mask, vmax=1, square=True)
# st.pyplot()