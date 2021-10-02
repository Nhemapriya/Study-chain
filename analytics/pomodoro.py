import streamlit as st
import time

def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

local_css("style.css")
st.write("""
#  HEAP Timer
""")

st.write('----')
st.write('Highly Effective And Productive technique')
st.write('to achieve your sub-goals')

button_clicked = st.button("Start")
st.sidebar.header('Learner Activity')
status = ['Reading article', 'Writing', 'Skimming pages', 'Story-building', 'Others...']

gender = st.sidebar.selectbox('To-Do Activity', list(status))

t1 = 1500
t2 = 300

if button_clicked:
    with st.empty():
        while t1:
            mins, secs = divmod(t1, 60)
            timer = '{:02d}:{:02d}'.format(mins, secs)
            st.header(f"⏳ {timer}")
            time.sleep(1)
            t1 -= 1
            st.success("🔔 25 minutes is over! Time for a break!")

    with st.empty():
        while t2:
            # Start the break
            mins2, secs2 = divmod(t2, 60)
            timer2 = '{:02d}:{:02d}'.format(mins2, secs2)
            st.header(f"⏳ {timer2}")
            time.sleep(1)
            t2 -= 1
            st.error("⏰ 5 minute break is over!")