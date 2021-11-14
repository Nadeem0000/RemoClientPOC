import * as React from 'react';
import styles from './RemoDepartmentKeyContacts.module.scss';
import { IRemoDepartmentKeyContactsProps } from './IRemoDepartmentKeyContactsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Version, Environment, EnvironmentType, ServiceScope, Log, Text } from "@microsoft/sp-core-library";
import { Label, Persona, PersonaSize, IPersonaProps, PersonaInitialsColor } from "@microsoft/office-ui-fabric-react-bundle";

export default class RemoDepartmentKeyContacts extends React.Component<IRemoDepartmentKeyContactsProps, {}> {
  public render(): React.ReactElement<IRemoDepartmentKeyContactsProps> {
    return (
      <div className={ styles.remoDepartmentKeyContacts }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
