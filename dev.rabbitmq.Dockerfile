FROM rabbitmq

ADD rabbitmq-init.sh /rabbitmq-init.sh
RUN chmod +x /rabbitmq-init.sh

ARG RABBIT_USERNAME=something
ENV RABBIT_USERNAME=${RABBIT_USERNAME}

ARG RABBIT_PASSWORD=something
ENV RABBIT_PASSWORD=${RABBIT_PASSWORD}

ENV RABBITMQ_PID_FILE=/var/lib/rabbitmq/mnesia/rabbitmq


EXPOSE 5671 5672

# Define default command
CMD ["/rabbitmq-init.sh"]
